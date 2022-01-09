import globalAPI from './global';
import hooksAPI from './hooks';
import stateAPI from './state';
import instanceAPI from './instance';
import componentAPI from './component';
import * as util from 'Framework-util';

const Framework = function (options) {
    this._init(options);
};
Framework.util = util;
Framework.data = '__frameworkui__';
Framework.prefixName = 'fui';
Framework.prefix = `${Framework.prefixName}-`;
Framework.options = {};
Framework.version = 1.0;

globalAPI(Framework);
hooksAPI(Framework);
stateAPI(Framework);
instanceAPI(Framework);
componentAPI(Framework);


export default Framework;
