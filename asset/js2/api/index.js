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



/**
 * @메서드 추가 
 * @use
 * @mixin
 * @extend
 * @update
 */
globalAPI(Framework);


/**
 * @프로토타입  메서드로 추가 
 *             비공개 메서드로 추가되는것 같다.
 * @_callConnected
 * @_callDisconnected
 * @_callUpdate
 * @_callWatches
 */
hooksAPI(Framework);

/**
 * @프로토타입  메서드로 추가 
 *             상태 관련 프로토타입 메서드
 * @_init
 * @_initData
 * @_initMethods
 * @_initComputeds
 * @_initProps
 * @_initEvents
 * @_unbindEvents
 * @_initObserver
 */
stateAPI(Framework);

/**
 * @공개    메서드
 *          인스턴스 관련 메서드
 * @$create
 * @$mount
 * @$reset
 * @$destroy
 * @$emit
 * @$update
 */
instanceAPI(Framework);

/**
 * @공개    메서드
 *          컴포넌트 관련 메서드
 * @component
 * @getComponents
 * @getComponent
 * @connect
 * @disconnect
 */
componentAPI(Framework);




export default Framework;
