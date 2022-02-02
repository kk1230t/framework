import {$$, assign, camelize, fastdom, hyphenate, isPlainObject, startsWith} from '../util/index';

export default function (GCui) {

    const DATA = GCui.data;
    const components = {};


    GCui.component = (name, options) => {
        name = hyphenate(name);
        if(!options){
            if (isPlainObject(components[name])) {
                components[name] = GCui.extend(components[name])
            }
            return components[name];
        }
        GCui[name] = function (element, data) {
            const component = GCui.component(name);
            return component.options.functional
                ? new component({data: isPlainObject(element) ? element : [...arguments]})
                : !element ? init(element) : $$(element).map(init)[0];
    
            
            function init(element) {
                
                const instance = GCui.getComponent(element, name);
                // console.log(instance)
                // console.log(new component({el: element, data}));

                if (instance) {
                    if (!data) {
                        return instance;
                    } else {
                        instance.$destroy();
                    }
                }
    
                return new component({el: element, data});
    
            }
    
        };
        
        const opt = isPlainObject(options) ? assign({}, options) : options.options;

        opt.name = name;

        // if (opt.install) {
        //     opt.install(GCui, opt, name);
        // }
        
        if (GCui._initialized && !opt.functional) {
            
            fastdom.read(() => GCui[name](`[${GCui.prefixName}-${id}],[data-${GCui.prefixName}-${id}]`));
        }

        return components[name] = isPlainObject(options) ? opt : options;


    }
    
    GCui.getComponents = element => element && element[DATA] || {};
    GCui.getComponent = (element, name) => GCui.getComponents(element)[name];
    
    GCui.connect = node => {
        if (node[DATA]) {
            for (const name in node[DATA]) {
                node[DATA][name]._callConnected();
            }
        }
        
        for (let i = 0; i < node.attributes.length; i++) {
            const name = getComponentName(node.attributes[i].name);
            if (name && name in components) {
                GCui[name](node);
            }
        }
        
    };
    
    GCui.disconnect = node => {
        for (const name in node[DATA]) {
            node[DATA][name]._callDisconnected();
        }
    };

}


export function getComponentName(attribute) {
    return startsWith(attribute, `${GCui.prefixName}-`) || startsWith(attribute, `data-${GCui.prefixName}-`)
        ? camelize(attribute.replace(`data-${GCui.prefixName}-`, '').replace(`${GCui.prefixName}-`, ''))
        : false;
}