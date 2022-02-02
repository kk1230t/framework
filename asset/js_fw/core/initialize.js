import {
    fastdom,
    isPlainObject,
    isString,
    mergeOptions,
    isArray,
    includes,
    hasOwn,
    on,
    assign
} from '../util/index';

export default function (UICommon) {
    let uid = 0;

    UICommon.prototype._init = function(opts) {
        const options = opts || {};
        options.data = normalizeData(options, this.constructor.options);
    
        this.$options = mergeOptions(this.constructor.options, options, this);
        this.$el = null;
        this.$props = {};
        this._uid = uid++;
        // console.log(this.options)
        this._initData();
        this._initMethods();
        this._initComputeds();
        
    
        if (options.el) {
            this.$mount(options.el);
        }
    }
    
    UICommon.prototype._initData = function () {
        const _ = this;
        const {data = {}} = this.$options;
        
        for (const key in data) {
            _.$props[key] = data[key];
        }
    }
    
    UICommon.prototype._initMethods = function () {
    
        const _ = this;
        const {methods} = this.$options;
        if (methods) {
            for (const key in methods) {
                _[key] = methods[key].bind(_);
            }
        }
    };
    
    UICommon.prototype._initComputeds = function () {
    
        const _ = this;
        const {computed} = this.$options;
    
        _._computeds = {};
    
        if (computed) {
            for (const key in computed) {
                registerComputed(_, key, computed[key]);
            }
        }
    };
    
    UICommon.prototype._initEvents = function () {
        this._events = [];
        const _ = this;
        const {events} = _.$options;
        if (events) {
            events.forEach(event => {
                if (!hasOwn(event, 'handler')) {
                    for (const key in event) {
                        registerEvent(_, event[key], key)
                    }
                } else {
                    registerEvent(_, event)
                }
            })
        }
    }

    UICommon.prototype._callHook = function (hook) {
        const handlers = this.$options[hook];
        if (handlers) handlers.forEach(handlers => handlers.call(this));
    }
    
    UICommon.prototype._callConnected = function () {
        if (this._connected) return;
    
        this._data = {};
        this._computeds = {};
        this._frames = {reads: {}, writes: {}};
    
        // this._initProps();
    
        this._callHook('beforeConnect');
        this._connected = true;
    
        this._initEvents();
        // this._initObserver();
    
        this._callHook('connected');
        this._callUpdate();
    }
    
    UICommon.prototype._callDisconnected = function () {
        if (!this_connected) return;
    
        this._callHook('beforeDisconnect');
    
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
    
        this._unbindEvents();
        this._callHook('disconnected');
    
        this._connected = false;
    }
    
    UICommon.prototype._callUpdate = function (e = 'update') {
        const type = e.type || e;
    
        if (includes(['update', 'resize'], type)) {
            this._callWatches();
        }
    
        const updates = this.$options.update;
        const {reads, writes} = this._frames;
    
        if (!updates) return;
    
        updates.forEach(({read, write, events}, i) => {
            if (type !== 'update' && !includes(events, type)) return;
    
            if (read && !includes(fastdom.reads, read[i])) {
                read[i] = fastdom.read(() => {
                    const result = this._connected && read.call(this, this._data, type);
    
                    if (result === false && write) {
                        fastdom.clear(writes[i]);
                    } else if (isPlainObject(result)) {
                        assign(this._data, result);
                    }
                });
            }
    
            if (write && !includes(fastdom.writes, writes[i])) {
                writes[i] = fastdom.write(() => this._connected && write.call(this, this._data, type))
            }
        }) 
    }
    
    UICommon.prototype._callWatches = function () {
    
        const {_frames} = this;
    
        if (_frames._watch) {
            return;
        }
    
        const initital = !hasOwn(_frames, '_watch');
    
        _frames._watch = fastdom.read(() => {
    
            if (!this._connected) {
                return;
            }
    
            const {$options: {computed}, _computeds} = this;
    
            for (const key in computed) {
    
                const hasPrev = hasOwn(_computeds, key);
                const prev = _computeds[key];
    
                delete _computeds[key];
    
                const {watch, immediate} = computed[key];
                if (watch && (
                    initital && immediate
                    || hasPrev && !isEqual(prev, this[key])
                )) {
                    watch.call(this, this[key], prev);
                }
    
            }
    
            _frames._watch = null;
    
        });
    
    };
}



function registerEvent(component, event, key) {
    if (!isPlainObject(event)) {
        event = ({name: key, handler: event});
    }

    let {name, el, handler, capture, passive, delegate, filter, self} = event;

    el = el || component.$el;

    component._events.push(
        on(
            el,
            name,
            !delegate ? null : 
                isString(delegate) ? delegate : delegate.call(component),
            isString(handler) ? component[handler] : handler.bind(component),
            {passive, capture, self}
        )
    )
    // console.log(component.$el)
}

function normalizeData({data, el}, {args, props = {}}) {
    data = isArray(data)
        ? !isEmpty(args)
            ? data.slice(0, args.length).reduce((data, value, index) => {
                if (isPlainObject(value)) {
                    assign(data, value);
                } else {
                    data[args[index]] = value;
                }
                return data;
            }, {})
            : undefined
        : data;

    if (data) {
        for (const key in data) {
            if (isUndefined(data[key])) {
                delete data[key];
            } else {
                data[key] = props[key] ? coerce(props[key], data[key], el) : data[key];
            }
        }
    }

    return data;
}

function registerComputed(component, key, cb) {
    Object.defineProperty(component, key, {

        enumerable: true,

        get() {

            const {_computeds, $props, $el} = component;

            if (!hasOwn(_computeds, key)) {
                _computeds[key] = (cb.get || cb).call(component, $props, $el);
            }

            return _computeds[key];
        },

        set(value) {

            const {_computeds} = component;

            _computeds[key] = cb.set ? cb.set.call(component, value) : value;

            if (isUndefined(_computeds[key])) {
                delete _computeds[key];
            }
        }

    });
}