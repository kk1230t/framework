import {
    apply, 
    mergeOptions, 
    parents, 
    toNode
} from '../util';

export default function (UICommon) {
    const DATA = UICommon.data;
    UICommon.use = function (plugin) {
        if (plugin.installed) return;
        plugin.call(null, this);
        plugin.installed = true;
    
        return this;
    }
    
    UICommon.extend = function (opts) {
        const options = opts || {};
        const Super = this;
        const Sub = function G(options) {
            this._init(options)
        }
    
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, options);
    
        Sub.super = Super;
        Sub.extend = Super.extend;
    
        return Sub;
    }
    UICommon.update = (element, e)=> {
        element = element ? toNode(element) : document.body;
        parents(element).reverse().forEach(element => update(element[DATA], e));
        apply(element, element => update(element[DATA], e));
    }
    Object.defineProperty(UICommon, 'container', {
    
        get() {
            return container || document.body;
        },
    
        set(element) {
            container = $(element);
        }
    
    });
}

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
