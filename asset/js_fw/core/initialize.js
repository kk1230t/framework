import {
    camelize,
    fastdom,
    isPlainObject,
    isString,
    mergeOptions,
    isArray,
    includes,
    hasOwn,
    on,
    assign,
    parseOptions,
    isUndefined,
    hyphenate,
    startsWith,
    toBoolean,
    toNumber,
    isEqual,
    data as getData
} from '../util/index';

export default function (UICommon) {
    let uid = 0;
    const prefix = UICommon.prefix;
    UICommon.prototype._init = function(opts) {
        const options = opts || {};
        options.data = normalizeData(options, this.constructor.options);
    
        this.$options = mergeOptions(this.constructor.options, options, this);
        this.$el = null;
        this.$props = {};
        this._uid = uid++;
        console.log(prefix);
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
            _.$props[key] = _[key] = data[key];
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
    
    UICommon.prototype._initProps = function (props) {

        let key;
        
        props = props || getProps(this.$options, this.$name);
        console.log(props)
        for (key in props) {
            if (!isUndefined(props[key])) {
                this.$props[key] = props[key];
            }
        }

        const exclude = [this.$options.computed, this.$options.methods];
        for (key in this.$props) {
            
            if (key in props && notIn(exclude, key)) {
                    
                this[key] = this.$props[key];
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

    UICommon.prototype._unbindEvents = function () {
        this._events.forEach(unbind => unbind());
        delete this._events;
    };

    UICommon.prototype._initObservers = function () {
        this._observers = [
            initChildListObserver(this),
            initPropsObserver(this)
        ];
    };

    UICommon.prototype._disconnectObservers = function () {
        this._observers.forEach(observer =>
            observer && observer.disconnect()
        );
    };

    UICommon.prototype._callHook = function (hook) {
        const handlers = this.$options[hook];
        if (handlers) handlers.forEach(handlers => handlers.call(this));
    }
    
    UICommon.prototype._callConnected = function () {
        if (this._connected) return;
    
        this._data = {};
        this._computeds = {};
        this._frames = {reads: {}, writes: {}};
    
        this._initProps();
    
        this._callHook('beforeConnect');
        this._connected = true;
    
        this._initEvents();
        if (window.MutationObserver) this._initObservers();
        
    
        this._callHook('connected');
        this._callUpdate();
    }
    
    UICommon.prototype._callDisconnected = function () {
        if (!this._connected) return;
    
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
    
        if (type === 'update' || type === 'resize') {
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
                // console.log(key)
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

function getProps(opts, name) {

    const data = {};
    const {args = [], props = {}, el} = opts;

    if (!props) {
        return data;
    }
    
    for (const key in props) {
        
        const prop = hyphenate(key);
        let value = getData(el, prop);
        if (isUndefined(value)) {
            continue;
        }

        value = props[key] === Boolean && value === ''
            ? true
            : coerce(props[key], value);

        if (prop === 'target' && (!value || startsWith(value, '_'))) {
            continue;
        }

        data[key] = value;
    }

    

    const options = parseOptions(getData(el, name), args);

    for (const key in options) {
        const prop = camelize(key);
        if (props[prop] !== undefined) {
            data[prop] = coerce(props[prop], options[key]);
        }
    }

    return data;
}

function notIn(options, key) {
    return options.every(arr => !arr || !hasOwn(arr, key));
}


function coerce(type, value) {

    if (type === Boolean) {
        return toBoolean(value);
    } else if (type === Number) {
        return toNumber(value);
    } else if (type === 'list') {
        return toList(value);
    }

    return type ? type(value) : value;
}

function toList(value) {
    return isArray(value)
        ? value
        : isString(value)
            ? value.split(/,(?![^(]*\))/).map(value => isNumeric(value)
                ? toNumber(value)
                : toBoolean(value.trim()))
            : [value];
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

function initChildListObserver(component) {
    const {el} = component.$options;

    const observer = new MutationObserver(() => component.$emit());
    observer.observe(el, {
        childList: true,
        subtree: true
    });

    return observer;
}

function initPropsObserver(component) {

    const {$name, $options, $props} = component;
    const {attrs, props, el} = $options;

    if (!props || attrs === false) {
        return;
    }
    
    const attributes = isArray(attrs) ? attrs : Object.keys(props);
    const filter = attributes.map(key => hyphenate(key)).concat($name);
    
    const observer = new MutationObserver(records => {
        console.log(records)
        const data = getProps($options, $name);
        if (records.some(({attributeName}) => {
            const prop = attributeName.replace('data-', '');
            return (prop === $name ? attributes : [camelize(prop), camelize(attributeName)]).some(prop =>
                !isUndefined(data[prop]) && data[prop] !== $props[prop]
            );
        })) {
            component.$reset();
        }
    });
    
    observer.observe(el, {
        attributes: true,
        attributeFilter: filter.concat(filter.map(key => `data-${key}`))
    });

    return observer;
}