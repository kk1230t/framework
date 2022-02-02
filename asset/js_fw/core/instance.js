import {
    hyphenate,
    within
} from '../util/index';

export default function (UICommon) {
    const DATA = UICommon.data;
    UICommon.prototype.$mount = function (el) {
        const {name} = this.$options;

        if (!el[DATA]) {
            el[DATA] = {};
        }

        if (el[DATA][name]) return;

        el[DATA][name] = this;

        this.$el = this.$options.el = this.$options.el || el;

        if (within(el, document)) {
            this._callConnected();
        }
    }
    UICommon.prototype.$reset = function () {
        this._callDisconnected();
        this._callConnected();
    }
    UICommon.prototype.$destroy = function (removeEl = false) {
        const {el, name} = this.$options;

        if (el) this._callDisconnected();

        this._callHook('destory');

        if (!el || !el[DATA]) return;

        delete el[DATA][name];

        if (!isEmpty(el[DATA])) delete el[DATA];

        if (removeEl) remove(this.$el);
    }

    UICommon.prototype.$emit = function (e)  {
        this._callUpdate(e);
    }

    UICommon.prototype.$update = function (element = this.$el, e) {
        UICommon.update(element, e);
    }

    UICommon.prototype.$getComponent = UICommon.getComponent;

    const names = {};
    Object.defineProperties(UICommon.prototype, {

        $container: Object.getOwnPropertyDescriptor(UICommon, 'container'),

        $name: {

            get() {
                const {name} = this.$options;
                if (!names[name]) {
                    names[name] = UICommon.prefix + hyphenate(name);
                }

                return names[name];
            }

        }

    });
}
