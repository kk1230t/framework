import {$, apply, isString, mergeOptions, parents, toNode} from '../util/index.js';

export default function (Framework) {

    const DATA = Framework.data;

    Framework.use = function (plugin) {
        if (plugin.installed) {
            return;
        }
        // console.dir(plugin);
        plugin.call(null, this);
        plugin.installed = true;

        return this;
    };

    Framework.mixin = function (mixin, component) {
        component = (isString(component) ? Framework.component(component) : component) || this;
        component.options = mergeOptions(component.options, mixin);
    };

    Framework.extend = function (options) {

        options = options || {};

        const Super = this;
        const Sub = function FrameworkComponent(options) {
            this._init(options);
        };

        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, options);

        Sub.super = Super;
        Sub.extend = Super.extend;

        return Sub;
    };

    Framework.update = function (element, e) {
        console.log(parents(element))
        element = element ? toNode(element) : document.body;
        // console.log(element);
        parents(element).reverse().forEach(element => update(element[DATA], e));
        apply(element, element => update(element[DATA], e));
    };

    let container;
    Object.defineProperty(Framework, 'container', {

        get() {
            return container || document.body;
        },

        set(element) {
            container = $(element);
        }

    });

    function update(data, e) {

        if (!data) {
            return;
        }

        for (const name in data) {
            if (data[name]._connected) {
                data[name]._callUpdate(e);
            }
        }

    }
}
