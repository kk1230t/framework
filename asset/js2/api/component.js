import {$$, assign, camelize, fastdom, hyphenate, isPlainObject, startsWith} from 'Framework-util';

export default function (Framework) {

    const DATA = Framework.data;

    const components = {};

    Framework.component = function (name, options) {

        const id = hyphenate(name);

        name = camelize(id);


        if (!options) {

            if (isPlainObject(components[name])) {
                components[name] = Framework.extend(components[name]);
            }

            return components[name];

        }

        

        // console.log(component);
        Framework[name] = function (element, data) {
            
            const component = Framework.component(name);
            return component.options.functional
                ? new component({data: isPlainObject(element) ? element : [...arguments]})
                : !element ? init(element) : $$(element).map(init)[0];

            
            function init(element) {
                
                const instance = Framework.getComponent(element, name);

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

        if (opt.install) {
            opt.install(Framework, opt, name);
        }
        
        if (Framework._initialized && !opt.functional) {
            
            fastdom.read(() => Framework[name](`[${Framework.prefixName}-${id}],[data-${Framework.prefixName}-${id}]`));
        }

        return components[name] = isPlainObject(options) ? opt : options;
    };

    Framework.getComponents = element => element && element[DATA] || {};
    Framework.getComponent = (element, name) => Framework.getComponents(element)[name];

    Framework.connect = node => {
        
        if (node[DATA]) {
            for (const name in node[DATA]) {
                node[DATA][name]._callConnected();
            }
        }

        for (let i = 0; i < node.attributes.length; i++) {
            const name = getComponentName(node.attributes[i].name);
            if (name && name in components) {
                Framework[name](node);
            }
        }
        
    };

    Framework.disconnect = node => {
        for (const name in node[DATA]) {
            node[DATA][name]._callDisconnected();
        }
    };

}

export function getComponentName(attribute) {
    return startsWith(attribute, `${Framework.prefixName}-`) || startsWith(attribute, `data-${Framework.prefixName}-`)
        ? camelize(attribute.replace(`data-${Framework.prefixName}-`, '').replace(`${Framework.prefixName}-`, ''))
        : false;
}
