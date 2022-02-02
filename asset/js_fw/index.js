import {
    fastdom,
    inBrowser,
    each,
    on,
    ready,
} from './util/index';

import globalApi from './core/global';
import initializeApi from './core/initialize';
import instanceApi from './core/instance';
import * as components from './components/index';
import componentCore from './core/component';
import setFramewrok from './core/start';



const GCui = function (options) {
    this._init(options);
};
// GCui.util = util;
GCui.data = 'uiComponents';
GCui.prefixName = 'kui';
GCui.prefix = `${GCui.prefixName}-`;
GCui.options = {};
GCui.version = 1.0;

// globalAPI Start
globalApi(GCui);
// globalAPI End

// hooksAPI, stateAPI Start
initializeApi(GCui);
// hooksAPI End

// componentAPI Start
componentCore(GCui);
// componentAPI End

// instanceAPI Start
instanceApi(GCui);
// instanceAPI End

// boot Start
setFramewrok(GCui);
// boot End

each(components, (component, name) => {
    return GCui.component(name, component)
});

GCui.use(function(GCui) {
    inBrowser && ready(() => {
        GCui.update();
        on(window, 'load resize', () => GCui.update(null, 'resize'))

        let pending;
        on(window, 'scroll', e => {
            
            if (pending) {
                return;
            }
            
            pending = true;
            fastdom.write(() => pending = false);

            GCui.update(null, e.type);

        }, {passive: true, capture: true});
    })
});

export default GCui;