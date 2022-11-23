import {getComponentName} from './component';
import {apply, fastdom, hasAttr, inBrowser} from 'Framework-util';

export default function (Framework) {
    const {connect, disconnect} = Framework;

    if (!inBrowser || !window.MutationObserver) {
        return;
    }

    fastdom.read(init);

    function init() {
        if (document.body) {
            apply(document.body, connect);
        }
        (new MutationObserver(mutations => {
            const updates = [];
            mutations.forEach(mutation => {
                applyMutation(mutation, updates)
            });
            updates.forEach(el => {
                //  console.log(el)
                Framework.update(el)
            });
        })).observe(document, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true
        });

        Framework._initialized = true;
    }

    function applyMutation(mutation, updates) {

        const {target, type} = mutation;
        // console.log(mutation);
        const update = type !== 'attributes'
            ? applyChildList(mutation)
            : applyAttribute(mutation);

        if (update && !updates.some(element => element.contains(target))) {
            updates.push(target.contains ? target : target.parentNode); // IE 11 text node does not implement contains
        }


    }

    function applyAttribute({target, attributeName}) {

        if (attributeName === 'href') {
            return true;
        }

        const name = getComponentName(attributeName);

        

        if (!name || !(name in Framework)) {
            return;
        }

        if (hasAttr(target, attributeName)) {
            
            Framework[name](target);
            return true;
        }

        const component = Framework.getComponent(target, name);

        if (component) {
            component.$destroy();
            return true;
        }

    }

    function applyChildList({addedNodes, removedNodes}) {

        for (let i = 0; i < addedNodes.length; i++) {
            apply(addedNodes[i], connect);
        }

        for (let i = 0; i < removedNodes.length; i++) {
            apply(removedNodes[i], disconnect);
        }

        return true;
    }

}


