import {hyphenate, isEmpty, remove, within} from 'Framework-util';

export default function (Framework) {

    const DATA = Framework.data;

    Framework.prototype.$create = function (component, element, data) {
        return Framework[component](element, data);
    };

    Framework.prototype.$mount = function (el) {

        const {name} = this.$options;

        if (!el[DATA]) {
            el[DATA] = {};
        }

        if (el[DATA][name]) {
            return;
        }

        el[DATA][name] = this;

        this.$el = this.$options.el = this.$options.el || el;

        if (within(el, document)) {
            this._callConnected();
        }
    };

    Framework.prototype.$reset = function () {
        this._callDisconnected();
        this._callConnected();
    };

    Framework.prototype.$destroy = function (removeEl = false) {

        const {el, name} = this.$options;

        if (el) {
            this._callDisconnected();
        }

        this._callHook('destroy');

        if (!el || !el[DATA]) {
            return;
        }

        delete el[DATA][name];

        if (!isEmpty(el[DATA])) {
            delete el[DATA];
        }

        if (removeEl) {
            remove(this.$el);
        }
    };

    Framework.prototype.$emit = function (e) {
        this._callUpdate(e);
    };

    Framework.prototype.$update = function (element = this.$el, e) {
        Framework.update(element, e);
    };

    Framework.prototype.$getComponent = Framework.getComponent;

    const names = {};
    Object.defineProperties(Framework.prototype, {

        $container: Object.getOwnPropertyDescriptor(Framework, 'container'),

        $name: {

            get() {
                const {name} = this.$options;

                if (!names[name]) {
                    names[name] = Framework.prefix + hyphenate(name);
                }

                return names[name];
            }

        }

    });

}
