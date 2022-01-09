import Framework from './api/index';
import Core from './core/core';
import boot from './api/boot';
import {each} from './util/lang';
import * as components from './core/index';
import { ready, fastdom } from 'Framework-util';;


console.log(Core);

// register components
console.log(components);
each(components, (component, name) => {
    return Framework.component(name, component)
});


Framework.use(Core);

boot(Framework);
// console.log(each);
console.dir(Framework);
// console.log(Framework.util);
fastdom.read(() => {
    // console.log('fastdom');
    console.log(document.querySelector('.fui-accordion'));
});
ready(() => {
    console.log('ready');
    console.log(document.querySelector('.fui-accordion'));
})



export default Framework;