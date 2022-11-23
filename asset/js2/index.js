import Framework from './api/index';
import Core from './core/core';
import boot from './api/boot';
import {each} from './util/lang';
import * as components from './core/index';
import { ready, fastdom } from 'Framework-util';;

boot(Framework);

// register components
each(components, (component, name) => {
    console.log(name)
    return Framework.component(name, component)
});


Framework.use(Core);

console.log()

// console.dir(Framework);

export default Framework;