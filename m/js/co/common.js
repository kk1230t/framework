/*!
 * @author ...
 * @description hmall 코어 라이브러리
 */
;(function(global, $, undefined){
    "use strict";
    // 기본 해상도 분기
    var DEFAULT_SCREEN_SIZE = [
        {
            mode: 'mobile',
            min: 0,
            max: 767
        },
        {
            mode: 'tablet',
            min: 768,
            max: 1024
        },
        {
            mode: 'web',
            min: 1025,
            max: 3840
        }
    ];
    global.LIB_NAME = 'UI';
    var LIB_NAME = global.LIB_NAME || 'UI',
        doc = global.document,
        extend = $.extend,
        proxy = $.proxy,
        $win = $(window),
        arrayProto = Array.prototype,
        objectProto = Object.prototype,
        objectString = objectProto.toString,
        hasOwn = objectProto.hasOwnProperty,
        arraySlice = arrayProto.slice,
        FUNCTION = "function",
        STRING = "string",
        NUMBER = "number",
        OBJECT = "object",
        NULL = "null",
        BOOLEAN = "boolean",
        UNDEFINED = "undefined",
        slice = [].slice,
        tmpInput = doc.createElement('input'),
        supportPlaceholder = ('placeholder' in tmpInput),
        isMobile = ('orientation' in global) || global.IS_MOBILE === true;
    if (global[LIB_NAME]) return;
	var core = global[LIB_NAME] || (global[LIB_NAME] = {});
    function Class() {}
    function isArray(it) {
        return objectString.call(it) === '[object Array]';
    }
    if(!String.prototype.replaceAll){
        String.prototype.replaceAll = function(org, dest) {
            return this.split(org).join(dest);
        }
    }
    Class.extend = function(proto) {
        var base = function() {},
            member,
            _ = this,
            subclass = proto && proto.init ? proto.init : function () {
                _.apply(this, arguments);
            },
            fn;

        base.prototype = _.prototype;
        fn = subclass.fn = subclass.prototype = new base();

        for (member in proto) {
            if (proto[member] != null && proto[member].constructor === Object) {
                // Merge object members
                fn[member] = extend(true, {}, base.prototype[member], proto[member]);
            } else {
                fn[member] = proto[member];
            }
        }

        fn.constructor = subclass;
        subclass.extend = _.extend;

        return subclass;
    };

    Date.prototype.format = function (f) {
        if (!this.valueOf()) return " ";
        var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
        var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
        var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var d = this;

        return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
            switch ($1) {
                case "yyyy": return d.getFullYear(); // 년 (4자리)
                case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
                case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)
                case "dd": return d.getDate().zf(2); // 일 (2자리)
                case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
                case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)
                case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
                case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)
                case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
                case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
                case "mm": return d.getMinutes().zf(2); // 분 (2자리)
                case "ss": return d.getSeconds().zf(2); // 초 (2자리)
                case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
                default: return $1;
            }
        });
    };
    String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
    String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
    Number.prototype.zf = function (len) { return this.toString().zf(len); };
    /**
     * core 하위에 name에 해당하는 네임스페이스를 생성하여 object를 설정해주는 함수
     *
     * @function
     * @name ui.addon
     *
     * @param {string} name .를 구분자로 해서 core을 시작으로 하위 네임스페이스를 생성. name이 없으면 core에 추가된다.
     * @param {Object|Function} obj
     *
     * @example
     * vcui.addon('urls', {
     *    store: 'Store',
     *    company: 'Company'
     * });
     */
    var addon = function (name, object, isExecFn) {
        if (typeof name !== 'string') {
            object = name;
            name = '';
        }

        var root = core,
            names = name ? name.split('.') : [],
            ln = names.length - 1,
            leaf = names[ln];

        if (isExecFn !== false && typeof object === 'function' && !hasOwn.call(object, 'superClass')) {
            object = object.call(root);
        }

        for (var i = 0; i < ln; i++) {
            root = root[names[i]] || (root[names[i]] = {});
        }

        return (leaf && (root[leaf] ? extend(root[leaf], object) : (root[leaf] = object))) || extend(root, object), object;
    },
    _bindType = function (name) {
        return function (val) {
            return isType(val, name);
        };
    },
    isType = function (value, typeName) {
        var isGet = arguments.length === 1;

        function result(name) {
            return isGet ? name : typeName === name;
        }

        if (value === null) {
            return result('null');
        }

        if (typeof value === undefined) {
            return 'undefined'
        }

        if (value && value.nodeType) {
            if (value.nodeType === 1 || value.nodeType === 9) {
                return result('element');
            } else if (value && value.nodeType === 3 && value.nodeName === '#text') {
                return result('textnode');
            }
        }

        if (typeName === 'object' || typeName === 'json') {
            return isGet ? 'object' : isPlainObject(value);
        }

        var s = toString.call(value),
            type = s.match(/\[object (.*?)\]/)[1].toLowerCase();

        if (type === 'number') {
            if (isNaN(value)) {
                return result('nan');
            }
            if (!isFinite(value)) {
                return result('infinity');
            }
            return result('number');
        }

        return isGet ? type : type === typeName;
    },
    each = function (obj, iterater, ctx) {
        if (!obj) {
            return obj;
        }
        var i = 0,
            len = 0,
            isArr = isArray(obj);

        if (isArr) {
            // 배열
            for (i = 0, len = obj.length; i < len; i++) {
                if (iterater.call(ctx || obj, obj[i], i, obj) === false) {
                    break;
                }
            }
        } else {
            // 객체체
            for (i in obj) {
                if (hasOwn.call(obj, i)) {
                    if (iterater.call(ctx || obj, obj[i], i, obj) === false) {
                        break;
                    }
                }
            }
        }
        return obj;
    },

    /**
     * @readonly
     * @name core.detect
     * @enum {*}
     * @property {boolean} mediaInfo // 현재 해상도별 구분 객체
     * @property {boolean} isTouch // 터치디바이스 여부
     * @property {boolean} isRetina // 레티나 여부
     * @property {boolean} isMobile // orientation 작동여부로 판단
     * @property {boolean} isMac // 맥OS
     * @property {boolean} isLinux // 리눅스
     * @property {boolean} isWin // 윈도우즈
     * @property {boolean} is64Bit // 64비트 플랫폼
     * @property {boolean} isIE // IE
     * @property {boolean} ieVersion // IE의 버전
     * @property {boolean} isOpera // 오페라
     * @property {boolean} isChrome // 크롬
     * @property {boolean} isSafari // 사파리
     * @property {boolean} isWebKit // 웹킷
     * @property {boolean} isGecko // 파이어폭스
     * @property {boolean} isIETri4 // IE엔진
     * @property {boolean} isAir // 어도비 에어
     * @property {boolean} isIOS // 아이폰, 아이패드
     * @property {boolean} isAndroid // 안드로이드
     * @property {number} iosVersion // ios 버전 : [8, 1, 0] -> [major, minor, revision]
     * @property {number} androidVersion // android 버전 : [4, 1, 0] -> [major, minor, revision]
     * @example
     * if(core.browser.isIE && core.browser.isVersion < 9) {
     *     alert('구버전을 사용하고 있습니다.');
     * }
     */
    detect = (function() {
        var detect = {},
            win = global,
            na = win.navigator,
            ua = na.userAgent,
            lua = ua.toLowerCase(),
            match;
        detect.mediaInfo = function(){};
        detect.mediaInfo.mode = null;
        detect.sizes = DEFAULT_SCREEN_SIZE;
        detect.placeholder = supportPlaceholder;
        detect.isStrict = (typeof global == 'undefined');

        detect.isRetina = 'devicePixelRatio' in global && global.devicePixelRatio > 1;
        detect.isAndroid = lua.indexOf('android') !== -1;
        detect.isBadAndroid = /Android /.test(na.appVersion) && !(/Chrome\/\d/.test(na.appVersion));
        detect.isOpera = !!(win.opera && win.opera.buildNumber);
        detect.isWebKit = /WebKit/.test(ua);
        detect.isTouch = !!('ontouchstart' in global);
        detect.isMobileDevice = ('ontouchstart' in win) || win.DocumentTouch && document instanceof DocumentTouch || na.msMaxTouchPoints || false;

        match = /(msie) ([\w.]+)/.exec(lua) || /(trident)(?:.*rv.?([\w.]+))?/.exec(lua) || ['', null, -1];
        detect.isIE = !detect.isWebKit && !detect.isOpera && match[1] !== null;
        detect.version = detect.ieVersion = parseInt(match[2], 10);
        detect.isOldIE = detect.isIE && detect.version < 9;

        detect.isWin = (na.appVersion.indexOf("Win") != -1);
        detect.isMac = (ua.indexOf('Mac') !== -1);
        detect.isLinux = (na.appVersion.indexOf("Linux") != -1);
        detect.is64Bit = (lua.indexOf('wow64') > -1 || (na.platform === 'Win64' && lua.indexOf('x64') > -1));

        detect.isChrome = (ua.indexOf('Chrome') !== -1);
        detect.isGecko = (ua.indexOf('Firefox') !== -1);
        detect.isAir = ((/adobeair/i).test(ua));
        detect.isIOS = /(iPad|iPhone)/.test(ua);
        detect.isSafari = !detect.isChrome && (/Safari/).test(ua);
        detect.isIETri4 = (detect.isIE && ua.indexOf('Trident/4.0') !== -1);
        detect.isGalaxy = (ua.indexOf(' SHV-') !== -1);

        detect.msPointer = !!(na.msPointerEnabled && na.msMaxTouchPoints && !win.PointerEvent);
        detect.pointer = !!((win.PointerEvent && na.pointerEnabled && na.maxTouchPoints) || detect.msPointer);

        // 앱 케이스 추가
        detect.isApp = (win.appYn !== undefined) ? win.appYn : null;
        detect.isAppType = (win.appOpsyNm !== undefined ) ? win.appOpsyNm : null;

        if (detect.isAndroid) {
            detect.androidVersion = function() {
                var v = ua.match(/[a|A]ndroid[^\d]*(\d+).?(\d+)?.?(\d+)?/);
                if (!v) {
                    return -1;
                }
                return [parseInt(v[1] | 0, 10), parseInt(v[2] | 0, 10), parseInt(v[3] | 0, 10)];
            }();
        } else if (detect.isIOS) {
            detect.iosVersion = function() {
                var v = ua.match(/OS (\d+)_?(\d+)?_?(\d+)?/);
                return [parseInt(v[1] | 0, 10), parseInt(v[2] | 0, 10), parseInt(v[3] | 0, 10)];
            }();
        }

        detect.isMobile = isMobile || detect.isIOS || detect.isAndroid;
        
        return detect;
    }()),
    transitionEnd = function() {
        var el = document.createElement('div')
    
        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        }
    
        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }
    
        return false
    };

    extend(core, {
        name: LIB_NAME,
        DEFAULT_SCREEN_SIZE : DEFAULT_SCREEN_SIZE,
        version: '0.7.0',
        noop: function() {},
        emptyFn: function() {},
        widgets : core.widgets || [],
        _widgetRegisteredCallbacks: [],
        ui : core.ui || {},
        Class : Class,
        addon : addon,
        detect : detect,
        prefix : '.hui',
        transitionEnd : transitionEnd,
        each : each,
        isType : isType,
        isArray: _bindType('array'),
        userScreenControl : false   // 사용자 화면 조작중 체크, 전역
    });
    extend($.fn, {
        handler: function(handler) {
            this.data("handler", handler);
            return this;
        },
        emulateTransitionEnd : function (duration) {
            var called = false
            var $el = this
            $(this).one('bsTransitionEnd', function () { called = true })
            var callback = function () { if (!called) $($el).trigger($.support.transition.end);}
            setTimeout(callback, duration);
            return this;
        },
        /**
         * 클래스 치환
         * @function
         * @name $#replaceClass
         * @param {string} old 대상클래스
         * @param {string} newCls 치환클래스
         * @return {jQuery}
         */
        replaceClass : function (old, newCls) {
            return this.each(function () {
                $(this).removeClass(old).addClass(newCls);
            });
        },
        /**
         * 같은 레벨에 있는 다른 row에서 on를 제거하고 현재 row에 on 추가
         * @function
         * @name $#activeItem
         * @param {string} className='on' 활성 클래스명
         * @return {jQuery}
         */
        activeItem : function (className, isActive) {
            className = className || 'on';
            if (typeof isActive === 'undefined') {
                isActive = true;
            }
            return this.toggleClass(className, isActive).siblings().toggleClass(className, !isActive).end();
        },
        /**
         * 해당 이미지가 로드됐을 때 콜백함수 실행
         * @function
         * @name $#onImgLoaded
         * @param {function(width:Number, height:Number)} callback width, height 인자를 갖는 콜백함수
         * @return {jQuery}
         */
        onImgLoaded : function (callback) {
            core.util.waitImageLoad(this).done(callback);
            return this;
        },

        /**
         * 비동기 방식으로 이미지 사이즈를 계산해서 콜백함수로 넘겨준다.
         * @function
         * @name $#getImgSize
         * @param {function(width:Number, height:Number)} cb width, height 인자를 갖는 콜백함수
         * @return {jQuery}
         */
        getImgSize : function (cb) {
            var $img = this.eq(0);
            $img.onImgLoaded(function () {
                cb && cb.call($img[0], $img.css('width', '').width(), $img.css('height', '').height());
            });
            return this;
        }
    });
    var Observable = Class.extend({
        init: function() {
            this._events = {};
        },

        bind: function(eventName, handlers, one) {
            var _ = this,
                idx,
                eventNames = typeof eventName === STRING ? [eventName] : eventName,
                length,
                original,
                handler,
                handlersIsFunction = typeof handlers === FUNCTION,
                events;

            if (handlers === undefined) {
                for (idx in eventName) {
                    _.bind(idx, eventName[idx]);
                }
                return _;
            }

            for (idx = 0, length = eventNames.length; idx < length; idx++) {
                eventName = eventNames[idx];

                handler = handlersIsFunction ? handlers : handlers[eventName];

                if (handler) {
                    if (one) {
                        original = handler;
                        handler = function() {
                            _.unbind(eventName, handler);
                            original.apply(_, arguments);
                        };
                        handler.original = original;
                    }
                    events = _._events[eventName] = _._events[eventName] || [];
                    events.push(handler);
                }
            }

            return _;
        },

        one: function(eventNames, handlers) {
            return this.bind(eventNames, handlers, true);
        },

        first: function(eventName, handlers) {
            var _ = this,
                idx,
                eventNames = typeof eventName === STRING ? [eventName] : eventName,
                length,
                handler,
                handlersIsFunction = typeof handlers === FUNCTION,
                events;

            for (idx = 0, length = eventNames.length; idx < length; idx++) {
                eventName = eventNames[idx];

                handler = handlersIsFunction ? handlers : handlers[eventName];

                if (handler) {
                    events = _._events[eventName] = _._events[eventName] || [];
                    events.unshift(handler);
                }
            }

            return _;
        },

        trigger: function(eventName, e) {
            var _ = this,
                events = _._events[eventName],
                idx,
                length;

            if (events) {
                e = e || {};

                e.sender = _;

                e._defaultPrevented = false;

                e.preventDefault = preventDefault;

                e.isDefaultPrevented = isDefaultPrevented;

                events = events.slice();

                for (idx = 0, length = events.length; idx < length; idx++) {
                    events[idx].call(_, e);
                }

                return e._defaultPrevented === true;
            }

            return false;
        },

        unbind: function(eventName, handler) {
            var _ = this,
                events = _._events[eventName],
                idx;

            if (eventName === undefined) {
                _._events = {};
            } else if (events) {
                if (handler) {
                    for (idx = events.length - 1; idx >= 0; idx--) {
                        if (events[idx] === handler || events[idx].original === handler) {
                            events.splice(idx, 1);
                        }
                    }
                } else {
                    _._events[eventName] = [];
                }
            }

            return _;
        }
    });

    var Widget = Observable.extend( {
        init: function(element, options) {
            var _ = this;
            _.element = $(element).handler(_);
            
            Observable.fn.init.call(_);

            var dataSource = options ? options.dataSource : null;
            var props;

            if (options) {
                props = (_.componentTypes || {})[(options || {}).componentType];
            }
            if (dataSource) {
                // avoid deep cloning the data source
                options = extend({}, options, { dataSource: {} });
            }

            options = _.options = extend(true, {}, _.options, _.defaults, props || {}, options);

            if (dataSource) {
                options.dataSource = dataSource;
            }

            _.element.data(options.name, _);

            _.bind(_.events, options);
        },

        events: [],

        options: {
            prefix: ""
        },

        _hasBindingTarget: function() {
            return !!this.element[0].bindingTarget;
        },

        _tabindex: function(target) {
            target = target || this.wrapper;

            var element = this.element,
                TABINDEX = "tabindex",
                tabindex = target.attr(TABINDEX) || element.attr(TABINDEX);

            element.removeAttr(TABINDEX);

            target.attr(TABINDEX, !isNaN(tabindex) ? tabindex : 0);
        },

        setOptions: function(options) {
            this._setEvents(options);
            $.extend(this.options, options);
        },

        _setEvents: function(options) {
            var _ = this,
                idx = 0,
                length = _.events.length,
                e;

            for (; idx < length; idx ++) {
                e = _.events[idx];
                if (_.options[e] && options[e]) {
                    _.unbind(e, _.options[e]);
                    if (_._events && _._events[e]) {
                        delete _._events[e];
                    }
                }
            }

            _.bind(_.events, options);
        },

        resize: function(force) {
            console.log(0)
            var size = this.getSize(),
                currentSize = this._size;
                
            if (force || (size.width > 0 || size.height > 0) && (!currentSize || size.width !== currentSize.width || size.height !== currentSize.height)) {
                this._size = size;
                this._resize(size, force);
                this.trigger("resize", size);
            }
        },

        getSize: function() {
            return core.dimensions(this.element);
        },

        size: function(size) {
            if (!size) {
                return this.getSize();
            } else {
                this.setSize(size);
            }
        },

        setSize: $.noop,
        _resize: $.noop,

        destroy: function() {
            var _ = this;

            _.element.removeData(_.options.prefix + _.options.name);
            _.element.removeData("handler");
            _.unbind();
        },
        _destroy: function() {
            this.destroy();
        }
    });
    extend(core.ui, {
        Widget: Widget,
        Observable : Observable,
        roles: {},
        plugin: function(widget, register, prefix) {
            var name = widget.fn.name;
            register = register || core.ui;
            prefix = prefix || "";
            register[name] = widget;

            register.roles[name.toLowerCase()] = widget;
            var widgetEntry = { name: name, widget: widget, prefix: prefix || "" };
            core.widgets.push(widgetEntry);
            for (var i = 0, len = core._widgetRegisteredCallbacks.length; i < len; i++) {
                core._widgetRegisteredCallbacks[i](widgetEntry);
            }

            $.fn[name] = function(options) {
                var value = this,
                    args;
                if (typeof options === STRING) {
                    this.each(function(){
                        var widget = $.data(this, name),
                            method,
                            result;
                        method = widget[options];
                        result = method.apply(widget, args);
                    });
                } else {
                    this.each(function() {
                        var $this = $(this)
                        var data  = $this.data(name)
                        if (!data) $this.data(name, (data = new widget(this, options)))
                    });
                }
                return value.data(name);
            };
            $.fn[name].Constructor = widget;
        },
        getNext : function(el, className){
            var checkTarget,
                loop = true,
                checkElement = el,
                checkClass = className;
            do {
                if(checkElement.localName == "body"){
                    // throw new Error(checkClass + "클래스를 찾지 못하였습니다");
                    return null;
                }
                checkTarget = checkElement.nextElementSibling;
                if(checkTarget && checkTarget.classList.contains(checkClass)){
                    loop = false;
                }else{
                    checkElement = checkElement.parentNode;
                }
            } while (loop);
            return {
                el : checkElement,
                trigger : checkTarget
            }; 
        },
        /**
         * 딤 생성
         * @param STRING
         */
        showDim : function(target){
            var root = $('body'),
                targetName = target || '',
                dim = $('<div id="bgDim" class="cm-dim">');
            if(target) dim.attr('data-call-fn', targetName)
            root.append(dim);
            setTimeout(function() {
                dim.addClass('hidden');
				root.addClass('hidden');
            }, 0)
        },
        /**
         * 딤 제거
         * @param $el
         */
		hideDim : function(){
			var root = $('body');
			root.removeClass('hidden');
            setTimeout(function() {
                $('#bgDim').remove();
            }, 0)
        },
        /**
         * 스크롤이벤트 무효화
         * @param $el
         */
        disableScroll: function ($el) {
            $el = $el || $win;

            var scrollTop = $el.scrollTop();
            $el.on("scroll.disableScroll mousewheel.disableScroll DOMMouseScroll.disableScroll touchmove.disableScroll", function (event) {
                event.preventDefault();
                $el.scrollTop(scrollTop);
            });
        },

        /**
         * 스크롤이벤트 무효화 취소
         * @param $el
         */
        enableScroll: function ($el) {
            $el = $el || $win;

            $el.off(".disableScroll");
        },
        /**
         * 모듈 리프레쉬
         * @param $el
         */
        modulesRefresh : function(el){
            var wrap = el;
            setTimeout(function(){  
                if( wrap.find('[data-modules-moreview]').length > 0 ){
                    wrap.find('[data-modules-moreview]').moreview('create');
                }
                if(wrap.find('[data-modules-cascadingGrid]').length !== 0){
                    wrap.find('[data-modules-cascadingGrid]').cascadingGrid('mount')
                }

                if(wrap.find('[data-modules-slick]').length !== 0){
                    wrap.find('[data-modules-slick]').slick('setPosition');
                }
                if(wrap.find('[data-modules-sticky]').length !== 0){
                    wrap.find('[data-modules-sticky]').sticky('posRefresh');
                }
            }, 0)
        }

        
    });
})(window, jQuery);

/**
 * @util 유틸함수 모음
 */
;(function(core, $, undefined){
    "use strict";
    var ampRegExp = /&/g,
        ltRegExp = /</g,
        quoteRegExp = /"/g,
        aposRegExp = /'/g,
        gtRegExp = />/g;
    core.addon('util', /** @lends UI.util */{
        /**
         * @param  {str} 문자열을 JSON형식의 데이터로 치환
         */
        stringToObject : function (str){
            if (typeof str === "object") return str;
            var str = str.replace(/\s/g, '');
            var obj;
            obj = JSON.parse(str);
            return obj;
        },
        /**
         * @param  {value} html 인코딩
         */
        htmlEncode : function (value) {
            return ("" + value).replace(ampRegExp, "&amp;").replace(ltRegExp, "&lt;").replace(gtRegExp, "&gt;").replace(quoteRegExp, "&quot;").replace(aposRegExp, "&#39;");
        },
        /**
         * 
         * @param {object} element 면적을 구할 엘리먼트
         * @param {*} dimensions 
         */
        dimensions : function(element, dimensions) {
            var domElement = element[0];
        
            if (dimensions) {
                element.css(dimensions);
            }
        
            return { width: domElement.offsetWidth, height: domElement.offsetHeight };
        },
        /**
         * 
         * @param {string} str css 리터럴문자열
         */
        cssLiteralToObject : function(str){
            var strValue = str, arr = strValue.split(';'), i = arr.length-1, obj = {},objArr,objFirst,objLast,objName,objProp,arrFirst,arrLast,firstStr, lastStr;
            for ( ; i >= 0; i--) {
                if(arr[i] !== ""){
                    
                    if( arr[i].indexOf('{') !== -1 || arr[i].indexOf('}') !== -1 || arr[i].indexOf('[') !== -1 || arr[i].indexOf(']') !== -1 ){
                        objFirst = arr[i].indexOf('{');
                        objLast = arr[i].lastIndexOf('}');
                        arrFirst = arr[i].indexOf('[');
                        arrLast = arr[i].lastIndexOf(']');
                        firstStr = arr[i].indexOf(':');
                        if(objFirst > arrFirst && arrFirst !== -1 ){
                            lastStr = arrLast;
                        }else if(objFirst < 0 && arrFirst > 0){
                            lastStr = arrLast;
                        }else{
                            lastStr = objLast;
                        }
                        objName = arr[i].slice(0, firstStr);
                        objProp = arr[i].slice(firstStr+1, lastStr+1).replaceAll('\'', '\"');

                        console.log(objProp);


                        obj[objName] = core.util.stringToObject(objProp);
                    }else{
                        objArr = arr[i].replaceAll(" ", "").split(':');
                        if(objArr.length !== 2 || objArr[1] == "" ){
                            throw new Error('옵션값이 잘못되었습니다.\n 잘못 전달된 옵션 속성 : '+strValue);
                        }
                        if(objArr[1].indexOf('true') !== -1 || objArr[1].indexOf('false') !== -1){
                            objArr[1] = objArr[1] === 'true';
                            // console.log(objArr[1])
                        }else if($.isNumeric(objArr[1])){
                            objArr[1] = Number(objArr[1]);
                        }
                        obj[objArr[0]] = objArr[1];
                    }
                }
            }
            return obj
        },
         /**
         * 팝업을 띄우는 함수
         * @param {string} url 주소
         * @param {Number=} width 너비. 또는 옵션
         * @param {Number=} height 높이.
         * @param {opts=} 팝업 창 모양 제어 옵션.(커스텀옵션: name(팝업이름), align(=center, 부모창의 가운데에 띄울것인가),
         * @example
         * UI.openPopup('http://google.com', 500, 400, {name: 'notice', align: null, scrollbars: 'no'});
         * //or
         * UI.openPopup('http://google.com', {name: 'notice', width: 500, height: 400, scrollbars: 'no'});
         */
        openPopup: function (url, width, height, opts) {
            var opts, name, width, height;
            if (arguments.length === 2 && typeof width === 'object') {
                opts = width;
                name = opts.name || 'popupWin';
                width = opts.width || 600;
                height = opts.height || 400;
                
            }

            opts = $.extend({
                name: 'popupWin',
                width: width || 600,
                height: height || 400,
                align: 'center',
                resizable: 'no',
                scrollbars: 'no'
            }, opts);

            var target = opts.target || opts.name || 'popupWin',
                feature = 'app_, ',
                tmp = [],
                winCoords;

            if (opts.align === 'center') {
                
                winCoords = core.util.popupCoords(opts.width, opts.height);
                opts.left = winCoords.left;
                opts.top = winCoords.top;
            }
            delete opts.name;
            delete opts.target;
            delete opts.align;

            core.detect.isSafari && tmp.push('location=yes');
            core.each(opts, function (val, key) {
                tmp.push(key + '=' + val);
            });
            feature += tmp.join(', ');

            var popupWin = window.open(url, target, feature);
            /*if (!popupWin || popupWin.outerWidth === 0 || popupWin.outerHeight === 0) {
                alert("팝업 차단 기능이 설정되어 있습니다\n\n차단 기능을 해제(팝업허용) 한 후 다시 이용해 주세요.");
                return false;
                }

                if (popupWin.location.href === 'about:blank') {
                popupWin.location.href = url;
                }*/

            return popupWin;
        },

        /**
         * 팝업을 띄운 후에 주어진 콜백함수를 호출
         * @param {string} url 주소
         * @param {object} feature 팝업 모양 (커스텀옵션: name(팝업이름), align(=center: 부모창의 가운데에 띄울것인가),
         * @param {function()} (Optional) callback 띄워진 후에 실행할 콜백함수
         * @example
         * UI.util.openPopupAndExec('http://google.com', {name: 'notice', width: 500, height:400, align: 'nw'}, function(popup){
         *     alert('팝업이 정상적으로 띄워졌습니다.');
         *     popup.close(); // 열자마자 닫아버림....:-b
         * });
         */
        openPopupAndExec: function (url, feature, callback) {
            feature || (feature = {});

            var popupWin;

            if ((popupWin = this.openPopup(url, feature.width, feature.height, feature)) === false) {
                return;
            }
            if (!callback) {
                return;
            }

            var limit = 0, // 5초 이내에 팝업이 로딩안되면 콜백함수 무시해버림
                fn = function () {
                    if (limit++ > 50) {
                        return;
                    }
                    if (!popupWin.document.body) {
                        setTimeout(fn, 100);
                        return;
                    }
                    callback && callback(popupWin);
                    popupWin.focus();
                };

            if (!popupWin.document.body) {
                setTimeout(fn, 100);
            } else {
                fn();
            }
        },


        /**
         * 컨텐츠 사이즈에 맞게 창사이즈를 조절
         * @example
         * UI.util.resizeToContent(); // 팝업에서만 사용
         */
        resizeToContent: function () {
            var innerX, innerY,
                pageX, pageY,
                win = window,
                doc = win.document;

            if (win.innerHeight) {
                innerX = win.innerWidth;
                innerY = win.innerHeight;
            } else if (doc.documentElement && doc.documentElement.clientHeight) {
                innerX = doc.documentElement.clientWidth;
                innerY = doc.documentElement.clientHeight;
            } else if (doc.body) {
                innerX = doc.body.clientWidth;
                innerY = doc.body.clientHeight;
            }

            pageX = doc.body.offsetWidth;
            pageY = doc.body.offsetHeight;

            win.resizeBy(pageX - innerX, pageY - innerY);
        },

        /**
         * 팝업의 사이즈에 따른 화면상의 중앙 위치좌표를 반환
         * @param {number} w 너비.
         * @param {number} h 높이.
         * @return {{left:Number, top:Number}} {left: 값, top: 값}
         */
        popupCoords: function (w, h) {
            w = w || 400;
            h = h || 300;

            var dualScreenLeft = 'screenLeft' in window ? window.screenLeft : screen.left,
                dualScreenTop = 'screenTop' in window ? window.screenTop : screen.top,
                width = window.innerWidth || document.documentElement.clientWidth || screen.width,
                height = window.innerHeight || document.documentElement.clientHeight || screen.height,
                left = ((width / 2) - (w / 2)) + dualScreenLeft,
                top = ((height / 2) - (h / 2)) + dualScreenTop;

            return {
                left: left,
                top: top
            };
        },

        /**
         * 주어진 시간과 남은 시간의 차이를 반환\
         * @param {element} 적용될 엘리먼트
         * @param {string} '20201010125900' 형식의 남은 시간 문자열
         * @param {format} 'dd, HH, mm, ss' 일, 시, 분, 초 의 포멧
         */
        countDownTimer: function (target, end, fm) {
            var format = fm || 'dd:hh:mm:ss',
                endTime = new Date(end.replace(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})([\d]{2})/, '$2/$3/$1 $4:$5:$6')),
                distance="",
                _second = 1000,
                _minute = _second * 60,
                _hour = _minute * 60,
                _day = _hour * 24,
                timer;
            function showRemaining(){
                var now = new Date();
                distance = endTime - now;
                if(distance<0){
                    clearInterval(timer);
                    return;
                } 
                var days = Math.floor(distance / _day),
                    hours = Math.floor((distance % _day) / _hour),
                    minutes = Math.floor((distance % _hour) / _minute),
                    seconds = Math.floor((distance % _minute) / _second),
                    result = format.replace(/(dd|hh|mm|ss)/gi, function ($1) {
                        switch ($1) {
                            case "dd": return days.zf(2);
                            case "hh": return hours.zf(2);
                            case "mm": return minutes.zf(2);
                            case "ss": return seconds.zf(2);
                            default: return $1;
                        }
                    });
                // console.log(result);
                target.text(result)
            };
            showRemaining();
            timer = setInterval(showRemaining, 1000)
        }
    });
})(window[LIB_NAME], jQuery);

/**
 * 
 * @events 이벤트
 */
;(function(core, $, undefined){
    "use strict";
	var r = document.querySelector('html'),
		w = $(window).width(),
		$html = $('html'),
		$event = $.event,
		$special,
        sizes = core.detect.sizes,
        lastScrollAt = Date.now(),
        timeout,
        scrollStartStop = function() {
			var $this = $(this)
			
			if (Date.now() - lastScrollAt > 100) $this.trigger('scrollstart')
				
			lastScrollAt = Date.now()
			
			clearTimeout(timeout)
			
			timeout = setTimeout(function() {
				if (Date.now() - lastScrollAt > 99) $this.trigger('scrollend')
			}, 100)
		},
		$special = $event.special.changeSize = {
			setup: function() {
				$( this ).on( "resize", $special.handler );
			},
			teardown: function() {
				$( this ).off( "resize", $special.handler );
			},
			handler: function( event, execAsap ) {
				var context = this,
					w = $(window).width(),
					mode = core.detect.mediaInfo.mode,
					dispatch = function(mode) {
						event.type = "changeSize";
						$(window).trigger('changeSize', mode);
					};
				for (var i = 0; sizes[i]; i++) {
					if (w >= sizes[i].min && w <= sizes[i].max && core.detect.mediaInfo.mode !== sizes[i].mode) {
						dispatch(sizes[i].mode);
						core.detect.mediaInfo.mode = sizes[i].mode;
						break;
					}
				}
			}
		};
	for (var i = 0; sizes[i] ; i++) {
		if (w >= sizes[i].min && w <= sizes[i].max) {
			switch (sizes[i].mode) {
				case 'mobile':
					r.classList.add('mobile')
					break;
				case 'tablet':
					r.classList.add('tablet')
					break;
				case 'web':
					r.classList.add('web')
					break;
			}
			core.detect.mediaInfo.mode = sizes[i].mode;
			break;
		}
    }
    $(document).on('scroll.startstop', scrollStartStop)
	$(window).on('changeSize', function(e, mode){
		for (var i = 0; i < sizes.length; i++) {
			$html.removeClass(sizes[i].mode);
		}
		$html.addClass(mode);
		core.detect.mediaInfo.mode = mode;
	})

	// transition end event
	$.support.transition = core.transitionEnd()
    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
		bindType: $.support.transition.end,
		delegateType: $.support.transition.end,
		handle: function (e) {
			if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
		}
    }
})(window[LIB_NAME], jQuery);


/**
 * 
 * UI 공통
 */
;(function(core, $, undefined){
    "use strict";

})(window[LIB_NAME], jQuery);

/* 
============================================================== UI 컴포넌트 Start
*/

/**
 * @name sticky
 * @selector [data-modules-sticky]'
 * @options breakPoint : $(element) 	// 전달된 셀렉터 의 포지션 하단에서 브레이크
 */
;(function(core, $, undefined){
    "use strict";
    var win = $(window),
    Default = {
        padding : 0,
        breakPoint : null,
        relativeLists : null,
        relativeTarget : null,
        activeSticky : false,
        className : null,
        align : 'top',
        name : "sticky"
    },
    activeClass = 'fixed',
    forEach = Array.prototype.forEach,
    name = "sticky",
    ui = core.ui,
    Widget = ui.Widget,
    Sticky = Widget.extend({
		name : name,
		init: function (element, config){
			var _ = this;
			var options = _.options = $.extend({}, Default, config);
			Widget.fn.init.call(_, element, options);
            _.options.padding = Number(_.options.padding);
            _.element.wrap('<div class="sticky-ui-wrapper">')
            _.element.before('<div class="sticky-placeholder">')    
            _.placehiolder = _.element.parent().find('.sticky-placeholder');
            _.wrapper = _.element.closest('.sticky-ui-wrapper');
            if(_.options.className !== null ) _.wrapper.addClass(_.options.className);
            _._setBreakPoint();
            _._isResize = false;
            _.posRefresh();
            _.activeSticky();
            // console.log(_.placehiolder.offset().top);
            $(this).trigger('scroll');
			_._bindEvent();
		},
		_bindEvent : function() {
            var _ = this;
            
            win.on('load', function(e){
                _._setBreakPoint();
                _.posRefresh();
                $(this).trigger('scroll');
            })
            .on('scroll', function(e){
                e.preventDefault();
                if(!_.element.is(':visible') || _._isResize ) return;
				var $this = $(this);
                var scrollPos = $this.scrollTop();
                _.options.pos = _.placehiolder.offset().top + _.options.padding;
				if(scrollPos > _.options.pos){
                    _.element.addClass(activeClass);
                    _.element.css(_.options.align, (Math.abs(_.options.padding)));
                    _.options.activeSticky = true;
					if(_.options.breakPoint !== null){
                        _._breakAction(scrollPos);                        
					}
				}else{
                    _.element.removeClass(activeClass);
                    _.element.css(_.options.align, '')
                    _.options.activeSticky = false;
				}
            })
            .on('resize', function(e){
                e.preventDefault();
                _._isResize = true;
                setTimeout(function(){
                    _.posRefresh(); 
                },0)
                
            })
		},
		posRefresh : function(pos){
            var _ = this;
            if(!_.element.is(':visible')) return;
            _.element.removeClass('fixed');
            _.element.css('top', '');
            _._setRelativeTarget();
            if(pos) _.options.padding = pos;
            
            _._isResize = false;
            win.trigger('scroll');
            
        },
        activeSticky : function(){
            var _ = this;
            if(_.options.activeSticky){
                $('html,body').stop().animate({ scrollTop: _.options.pos}, 300);
            }
        },
		_breakAction : function(pos) {
            var _ = this;
			var breakPointPos = _.breakPoint.offset().top + _.breakPoint.outerHeight() + pos;
            var elPos = _.element.offset().top + _.element.outerHeight() + pos;
			if(breakPointPos < elPos){
                _.element.find(".sticky-inner").css({"transform":"translate(0, "+(breakPointPos - elPos)+"px)"});
                _.element.addClass('ui-break');
			}else{
                _.element.find(".sticky-inner").css('transform','');
                _.element.removeClass('ui-break');
			}
        },
        _setRelativeTarget : function(){
            var _ = this;
            if(_.options.relativeLists !== null){
                var elTop = 0;
                forEach.call(_.options.relativeLists, function (item, i) {
                    var el = $(item);
                    var padding = 0;
                    if(el.length > 0){
                        padding = el.outerHeight();
                    }
                    console.log(el.outerHeight());
                    elTop += padding;
                });
                _.options.padding = (elTop*-1);
            }
            if(_.options.relativeTarget !== null){
                var el = $(_.options.relativeTarget);
                if(el.data(name)){
                    _.options.padding = (el.outerHeight() - el.data(name).options.padding) * -1;
                }else if(el.length !== 0){
                    _.options.padding = el.outerHeight() * -1;
                }else{
                    _.options.padding = 0;
                }
                
            }
        },
        _setBreakPoint : function(){
            var _ = this;
            if(_.options.breakPoint !== null && _.element.closest(_.options.breakPoint).length > 0){
                _.breakPoint = _.element.closest(_.options.breakPoint);
                // console.log(_.options.breakPoint);
            }else{
                _.breakPoint = $(_.options.breakPoint)
            }
        }
	})
    ui.plugin(Sticky);
})(window[LIB_NAME], jQuery);

/**
 * @name dropdown
 * @selector [data-modules-dropdown]'
 */
;(function(core, $, undefined){
    "use strict";
    var backdrop = '.dropdown-backdrop',
        toggle   = '[data-modules-dropdown]',
        activeClass = "ui-active",
        name = 'dropdown';


    var Dropdown = function (element, opt) {
        $(element).on('click.'+core.prefix+'.'+name, this.toggle)

    }

    function getParent($this) {
        var selector = $this.attr('data-target')

        if (!selector) {
        selector = $this.attr('href')
        selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = selector && $(selector)

        return $parent && $parent.length ? $parent : $this.parent()
    }

    function clearMenus(e) {
        if (e && e.which === 3) return
        $(backdrop).remove()
        $(toggle).each(function () {
            var $this         = $(this)
            var $parent       = getParent($this)
            var relatedTarget = { relatedTarget: this }

            if (!$parent.hasClass(activeClass)) return

            if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

            $parent.trigger(e = $.Event('hide.'+core.prefix+'.'+name, relatedTarget))

            if (e.isDefaultPrevented()) return

            $this.attr('aria-expanded', 'false')
            $parent.removeClass(activeClass).trigger($.Event('hidden.'+core.prefix+'.'+name, relatedTarget))
        })
    }

    Dropdown.prototype.toggle = function (e) {
        var $this = $(this)
        
        if ($this.is('.disabled, :disabled, .readonly')){
            e.preventDefault();
            return;
        } 

        var $parent  = getParent($this)
        var isActive = $parent.hasClass(activeClass)

        clearMenus()

        if (!isActive) {
        if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
            // if mobile we use a backdrop because click events don't delegate
            $(document.createElement('div'))
            .addClass('dropdown-backdrop')
            .insertAfter($(this))
            .on('click', clearMenus)
        }

        var relatedTarget = { relatedTarget: this }
        $parent.trigger(e = $.Event('show.'+core.prefix+'.'+name, relatedTarget))

        if (e.isDefaultPrevented()) return

        $this
            .trigger('focus')
            .attr('aria-expanded', 'true')

        $parent
            .toggleClass(activeClass)
            .trigger($.Event('shown.'+core.prefix+'.'+name, relatedTarget))
        }
        
        return false
    }

    Dropdown.prototype.keydown = function (e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

        var $this = $(this)

        e.preventDefault()
        e.stopPropagation()

        if ($this.is('.disabled, :disabled')) return

        var $parent  = getParent($this)
        var isActive = $parent.hasClass(activeClass)

        if (!isActive && e.which != 27 || isActive && e.which == 27) {
        if (e.which == 27) $parent.find(toggle).trigger('focus')
            return $this.trigger('click')
        }

        var desc = ' li:not(.disabled):visible a'
        var $items = $parent.find('.dropdown-menu' + desc)

        if (!$items.length) return

        var index = $items.index(e.target)

        if (e.which == 38 && index > 0)                 index--         // up
        if (e.which == 40 && index < $items.length - 1) index++         // down
        if (!~index)                                    index = 0

        $items.eq(index).trigger('focus')
    }


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
        var $this = $(this)
        var data  = $this.data('dropdown')

        if (!data) $this.data('dropdown', (data = new Dropdown(this)))
        if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.dropdown

    $.fn.dropdown             = Plugin
    $.fn.dropdown.Constructor = Dropdown


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old
        return this
    }


    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
        // .on('click'+core.prefix+'.'+name+'.data-api', clearMenus)
        // .on('click'+core.prefix+'.'+name+'.data-api', '.dropdown form', function (e) { e.stopPropagation() })
        .on('click'+core.prefix+'.'+name+'.data-api', toggle, Dropdown.prototype.toggle)
        .on('keydown'+core.prefix+'.'+name+'.data-api', toggle, Dropdown.prototype.keydown)
        .on('keydown'+core.prefix+'.'+name+'.data-api', '.dropdown-menu', Dropdown.prototype.keydown)
})(window[LIB_NAME], jQuery);

/**
 * @name tab
 * @selector [data-modules-tab]'
 */
;(function(core, $, undefined){
    "use strict";
   
    var selector   = '[data-modules-tab]',
        name = 'tab',
        ui = core.ui,
        Widget = ui.Widget,
        Default = {
            activeClass : "ui-active",
            DURATIONS : 500,
            selector : selector
        },
        Tab = Widget.extend({
            name : name,
            init: function (element, config){
                var _ = this;
                var options = _.options = $.extend({}, Default, config);
                Widget.fn.init.call(_, element, options);
            },
            show : function () {
                var _ = this;
                var $this    = this.element
                var $ul      = $this.closest('ul:not(.dropdown-menu)')
                var selector = $this.data('target')
            
                if (!selector) {
                    selector = $this.attr('href')
                    selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
                    if ($this[0].hash === '') {
                        selector = 'template';
                    }
                }
            
                if ($this.parent('li').hasClass(_.options.activeClass)) return
            
                var $previous = $ul.find('.'+_.options.activeClass+':last a')
                var hideEvent = $.Event('hide'+core.prefix+'.'+name, {
                    relatedTarget: $this[0]
                })
                var showEvent = $.Event('show'+core.prefix+'.'+name, {
                    relatedTarget: $previous[0]
                })
            
                $previous.trigger(hideEvent)
                $this.trigger(showEvent)
            
                if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return
                _.target = $(document).find(selector)
            
                this.activate($this.closest('li'), $ul)
                this.activate(_.target, _.target.parent(), function () {
                    $previous.trigger({
                        type: 'hidden'+core.prefix+'.'+name,
                        relatedTarget: $this[0]
                    })
                    $this.trigger({
                        type: 'shown'+core.prefix+'.'+name,
                        relatedTarget: $previous[0]
                    })
                })


                _.reloadModules();
            },
            
            activate : function (element, container, callback) {
                var _ = this;
                var $active    = container.find('> .'+_.options.activeClass)
                var transition = callback
                    && $.support.transition
                    && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)
            
                function next() {
                    $active
                        .removeClass(_.options.activeClass)
                        .find('> .dropdown-menu > .'+_.options.activeClass)
                        .removeClass(_.options.activeClass)
                        .end()
                        .find(_.options.selector)
                        .attr('aria-expanded', false)
            
                    element
                        .addClass(_.options.activeClass)
                        .find(_.options.selector)
                        .attr('aria-expanded', true)
            
                    if (transition) {
                        element[0].offsetWidth // reflow for transition
                        element.addClass('in')
                    } else {
                        element.removeClass('fade')
                    }
            
                    if (element.parent('.dropdown-menu').length) {
                        element
                            .closest('li.dropdown')
                            .addClass(_.options.activeClass)
                            .end()
                            .find(_.options.selector)
                            .attr('aria-expanded', true)
                    }
            
                    callback && callback()
                }
            
                $active.length && transition ?
                     $active
                        .one('bsTransitionEnd', next)
                        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
                    next()
                
                    $active.removeClass('in')
            },
            reloadModules : function(){
                var _ = this;
                if( _.target.find('[data-modules-moreview]').length > 0 ){
                    _.target.find('[data-modules-moreview]').moreview('create');
                }

                if(_.target.find('[data-modules-cascadingGrid]').length !== 0){
                    _.target.find('[data-modules-cascadingGrid]').cascadingGrid('mount')
                }

                if(_.target.find('[data-modules-slick]').length !== 0){
                    _.target.find('[data-modules-slick]').slick('setPosition');
                }
                
            }
        })
    ui.plugin(Tab);

    function clickHandler(e){
        var $this = $(this);

        if(!$this.data('tab')){
            $(selector).each(function(){
                var $this = $(this);
                if(!$this.data('tab')){
                    $this[name]();
                }
            })
        }
        $this[name]().show();
        return false;
    }
    $(document)
        .on('click'+core.prefix+'.'+name+'.data-api', selector, clickHandler)
})(window[LIB_NAME], jQuery);


/**
 * @name collapse
 * @selector [data-modules-collapse]'
 */
;(function(core, $, undefined){
    "use strict";
   
    var selector   = '[data-modules-collapse]',
        name = 'collapse',
        ui = core.ui,
        Widget = ui.Widget,
        Default = {
            activeClass : "selected",
            DURATIONS : 350,
            selector : selector,
            targetClass : 'accordion-panel',
            animate : false,
            animationClass : 'collapsani',
            parent : null
        },
        Collapse = Widget.extend({
            name : name,
            init: function (element, config){
                var _ = this;
                var options = _.options = $.extend({}, Default, config);
                Widget.fn.init.call(_, element, options);
                _.transitioning = null;
                _.element = $(element);
                var target = ui.getNext(element, _.options.targetClass);
                _.$element = $(target.el);
                _.$trigger = $(target.trigger);
                _.$parent = _.$element.closest(_.options.parent);
                _._bindEvent();
            },
            _bindEvent : function(){
                var _ = this;
                _.element.on('click'+core.prefix+'.'+name+'.data-api', $.proxy(_._handler, this))
            },
            _handler : function(e){
                e.preventDefault();
                var _ = this,
                    el = e.currentTarget;
                if(_.options.animate && $(el).hasClass(_.options.animationClass)) return;
                _.toggle();
            },
            dimension : function () {
                var hasWidth = this.$element.hasClass('width')
                return hasWidth ? 'width' : 'height'
            },
            show : function () {
                var _ = this;
                var openTrigger = _.$parent.find('.'+_.options.activeClass+'.'+_.options.targetClass)
                if(_.$parent && openTrigger){
                    // .removeClass(_.options.activeClass)
                    // .removeClass(_.options.activeClass)
                    // _.hide(openTrigger.prev(), openTrigger)
                    openTrigger.prev().collapse('toggle')
                }
                if(_.options.animate){
                    _.$element
                        .addClass(_.options.activeClass)
                        .addClass(_.options.animationClass);
                    _.$trigger
                        .addClass(_.options.animationClass)
                        .addClass(_.options.activeClass)
                        .height(_.$trigger[0].scrollHeight);
                        
                    if( parseFloat(window.getComputedStyle(_.$trigger[0]).transitionDuration) > 0 ){
                        _.$trigger.one('bsTransitionEnd', function(e){
                            _.$trigger.height('auto');
                            _.$trigger.removeClass(_.options.animationClass);
                            _.$element.removeClass(_.options.animationClass);
                        })
                    }else{
                        _.$trigger.height('auto');
                        _.$trigger.removeClass(_.options.animationClass);
                        _.$element.removeClass(_.options.animationClass);
                    }
                    
                }else{
                    _.$element.addClass(_.options.activeClass);
                    _.$trigger.addClass(_.options.activeClass);
                }
                
            },
            hide : function (el, tigr) {
                var _ = this;
                var nav = el !== undefined ? el : _.$element
                var cont = tigr !== undefined ? tigr : _.$trigger
                if(_.options.animate){
                    _.$element.removeClass(_.options.activeClass);
                    _.$element.addClass(_.options.animationClass);
                    _.$trigger
                        .height(_.$trigger[0].offsetHeight)    
                        .addClass(_.options.animationClass)
                        .height(0);
                    if( parseFloat(window.getComputedStyle(_.$trigger[0]).transitionDuration) > 0 ){
                        _.$trigger.one('bsTransitionEnd', function(e){
                            _.$trigger
                                .height('')
                                .removeClass(_.options.animationClass)
                                .removeClass(_.options.activeClass)
                            _.$element.removeClass(_.options.animationClass);
                        })
                    }else{
                        _.$trigger
                            .height('')
                            .removeClass(_.options.animationClass)
                            .removeClass(_.options.activeClass)
                        _.$element.removeClass(_.options.animationClass);
                    }
                }else{
                    _.$element.removeClass(_.options.activeClass);
                    _.$trigger.removeClass(_.options.activeClass);
                }
            },            
            toggle : function () {
                var _ = this;
                _[_.$element.hasClass(_.options.activeClass) ? 'hide' : 'show']()
            }
        })
    ui.plugin(Collapse);

    // function clickHandler(e){
    //     var $this = $(this);

    //     if(!$this.data(name)){
    //         $(selector).each(function(){
    //             var $this = $(this);
    //             if(!$this.data(name)){
    //                 $this[name]();
    //             }
    //         })
    //     }
    //     $this[name]()._handler(e);
    //     return false;
    // }
    // $(document)
    //     .on('click'+core.prefix+'.'+name+'.data-api', selector, clickHandler)
})(window[LIB_NAME], jQuery);

/**
 * @name customtoggle
 * @selector [data-modules-customtoggle]'
 */
;(function(core, $, undefined){
    "use strict";
   
    var selector   = '[data-modules-customtoggle]',
        name = 'customtoggle',
        ui = core.ui,
        Widget = ui.Widget,
        Default = {
            activeClass : "ui-active",
            grouping : null,
            parent : null,
            openText:'더보기',
            closeText:'닫기',
            textCtr : "[data-text]",
            closeBtn : "[data-close-btn]"
        },
        Customtoggle = Widget.extend({
            name : name,
            init: function (element, config){
                var _ = this;
                var options = _.options = $.extend({}, Default, config);
                Widget.fn.init.call(_, element, options);
                _.transitioning = null;
                _.element = $(element);
                _.text = _.element.find(_.options.textCtr);
                _.$parent = (_.options.parent) ? _.element.closest(_.options.parent) : _.element;
                _._bindEvent();
            },
            _bindEvent : function(){
                var _ = this;
                _.element.on('click'+core.prefix+'.'+name+'.data-api', $.proxy(_._handler, this));
                _.$parent.on('click'+core.prefix+'.'+name+'.data-api', _.options.closeBtn, $.proxy(_.toggle, this));
            },
            _handler : function(e){
                e.preventDefault()
                var _ = this;
                _.toggle();
            },
            show : function () {
                var _ = this,
                    scTop = $(window).scrollTop();
                if(_.options.grouping !== null){
                    $(_.options.grouping).find('.'+_.options.activeClass +' '+selector).trigger('click')
                }
                _.$parent.addClass(_.options.activeClass);
                $(window).scrollTop(scTop);
                if(_.text.length){
                    _.text.text(_.options.closeText)
                }
                core.ui.modulesRefresh(_.$parent);
            },
            hide : function () {
                var _ = this,
                scTop = $(window).scrollTop();
                _.$parent.removeClass(_.options.activeClass);
                $(window).scrollTop(scTop);
                if(_.text.length){
                    _.text.text(_.options.openText)
                }
            },            
            toggle : function (e) {
                var _ = this;
                _[_.$parent.hasClass(_.options.activeClass) ? 'hide' : 'show']();
                _.element.trigger(e = $.Event('toggle.'+name, { relatedTarget: this }))
            }
        })
    ui.plugin(Customtoggle);

    // function clickHandler(e){
    //     var $this = $(this);

    //     if(!$this.data(name)){
    //         $(selector).each(function(){
    //             var $this = $(this);
    //             if(!$this.data(name)){
    //                 $this[name]();
    //             }
    //         })
    //     }
    //     $this[name]().show();
    //     return false;
    // }
    // $(document)
    //     .on('click'+core.prefix+'.'+name+'.data-api', selector, clickHandler)
})(window[LIB_NAME], jQuery);



/**
 * @name cascadingGrid
 * @selector [data-modules-cascadingGrid]'
 */
;(function(core, $, undefined){
    "use strict";
   
    var selector   = '[data-modules-cascadingGrid]',
        forEach = Array.prototype.forEach,
        win = $(window),
        name = 'cascadingGrid',
        ui = core.ui,
        Widget = ui.Widget,
        Default = {
            padding : 0,
            items : null
        },
        CascadingGrid = Widget.extend({
            name : name,
            init : function (element, config){
                var _ = this;
                var options = _.options = $.extend({}, Default, config);
                _.element = $(element);
                Widget.fn.init.call(_, element, options);
                _.mount();
                win.on('load resize', function(){
                    _.mount();
                });
                // if(_.element.closest('[data-modules-tab]').length !== 0){
                //     $('[data-modules-tab]').on('show.hui.tab', function(){
                //         $(selector).CascadingGrid().mount();
                //     })
                // }
            },
            mount : function (){
                var _ = this;
                _.element.width('auto');
                _.items = _.element.find('[data-items]');
                var containerWidth = _.element.outerWidth(),
                    itemWidth = _.items[0].getBoundingClientRect().width + _.options.padding,
                    cols = Math.max(Math.floor( (containerWidth+_.options.padding) / (itemWidth)), 1),
                    count = 0,
                    itemsPosX = [],
                    itemsGutter = [];
                // console.log(containerWidth+wrapPadding)
                _.element.css({"width":(itemWidth * cols - _.options.padding) + 'px'});
                
                for ( var g = 0 ; g < cols ; ++g ) {
                    itemsPosX.push(g * itemWidth + _.options.padding);
                    itemsGutter.push(_.options.padding);
                }
                forEach.call(_.items, function (item, i) {
                    var itemIndex = itemsGutter
                        .slice(0)
                        .sort(function (a, b) {
                            return a - b;
                        })
                        .shift();
                    itemIndex = itemsGutter.indexOf(itemIndex);
                    var posX = parseInt(itemsPosX[itemIndex]) - _.options.padding;
                    var posY = parseInt(itemsGutter[itemIndex]) - _.options.padding;
    
                    item.style.transform = 'translate(' + posX + 'px,' + posY + 'px)';
    
                    itemsGutter[itemIndex] += item.getBoundingClientRect().height + _.options.padding;
                    count = count + 1;
                });
                var containerHeight = itemsGutter
                .slice(0)
                .sort(function (a, b) {
                    return a - b;
                })
                .pop();
                _.element.height(containerHeight)
            }
        })
    ui.plugin(CascadingGrid);
})(window[LIB_NAME], jQuery);

/**
 * @name selectbox
 * @selector [data-modules-selectbox]'
 */
;(function(core, $, undefined){
    "use strict";
   
    var selector   = '[data-modules-selectbox]',
        forEach = Array.prototype.forEach,
        win = $(window),
        doc = $(document),
        name = 'selectbox',
        ui = core.ui,
        Widget = ui.Widget,
        Default = {
            activeClass : "ui-active",
            mouseenter : false,
        },
        Selectbox = Widget.extend({
            name : name,
            init : function (element, config){
                var _ = this;
                var options = _.options = $.extend({}, Default, config);
                var selectTrigger = false;
                _.element = $(element);
                Widget.fn.init.call(_, element, options);
                _.$selectbox = _.element.find('> select');
                _.$list = $('<div class="ui-selectbox" />');
                _.$label = $('<div class="ui-label" />');
                _.$option = _.$selectbox.find('option');
                _.$label.append('<a>');
                _.element.wrap('<div class="selectwrap">').append(_.$label).append(_.$list);
                _._create(selectTrigger);
                _._bindEvents();
            },
            _create: function(selectTrigger) { 
                var _ = this, 
                    list= '', 
                    selectIndex = 0;

                forEach.call(_.$option, function (elem, index) {
                    if(elem.hasAttribute("selected") || elem.selected){
                        selectIndex = index;
                    }
                    list += '<li><a href="#'+(index+1)+'">'+$(elem).html()+'</a></li>'; 
                });
                _._updateLabel(selectIndex, selectTrigger);
                _.$list.empty().html( '<div class="selectbox_area"><ul>'+list+'</ul></div>'); 
            },
            _bindEvents: function(){
                var _ = this,
                    timer;
                _.$label.find('>a').on('click', function(e){
                    e.preventDefault();
                    if(_.options.mouseenter) return;
                    if(_.checkDisabled()){
                        return false;
                    }
                    var $this = $(this);
                    if(_.element.hasClass(_.options.activeClass)){
                        _.close();
                    }else{
                        _.open();
                    }
                }).on('focusout focusin', function(e) {
                    var $this = $(this);
                    if(_.checkDisabled()){
                        return false;
                    }
                    clearTimeout(timer), timer = null; 
                    if( e.type === 'focusout' && _.element.hasClass(_.options.activeClass) ) {
                        timer = setTimeout( function() {
                            _.close();
                        }, 200 );
                    }
                });
                if(_.options.mouseenter){
                    _.element.on('mouseenter', function(e){
                        if(_.checkDisabled()){
                            return false;
                        }
                        _.open();
                    })
                    .on('mouseleave', function(e){
                        _.close();
                    })
                }
                _.$list.on('click', 'a', function( e ) {
                    e.preventDefault();
                    var selectIndex = $(this).parent().index(),
                        selectTrigger = true;
                    _._updateLabel(selectIndex, selectTrigger);
                    _.close();

                }).on('focusout focusin', function( e ) {
                    clearTimeout(timer), timer = null; 
                    if( e.type === 'focusout' && _.element.hasClass(_.options.activeClass) ) {
                        timer = setTimeout( function() {
                            _.close();
                        }, 200 );
                    }
                }).on('keydown', 'a', function( e ) {

                });
            },
            open : function(){
                var _ = this;
                _.$list.show();
                _.setPosition();
                _.element.addClass(_.options.activeClass);
            },
            close : function(){
                var _ = this;
                _.$list.hide();
                _.element.removeClass('ui-bottom');
                _.element.removeClass(_.options.activeClass);
                
            },
            setPosition : function(){
                var _ = this;
                var scrollTop = win.scrollTop();
                var winHeight = win.height();
                var uiPosX = _.$list.offset().top;
                var uiHeight = _.$list.outerHeight();
                if( (uiPosX + uiHeight) >  (winHeight + scrollTop) && _.element.offset().top > _.$list.height() ){
                    _.element.addClass('ui-bottom');
                }
            },
            _updateLabel : function(index, selectTrigger){
                var _ = this;
                _.$selectbox[0].selectedIndex = index;
                _.$label.find('>a').empty().text(_.$option.eq(index).html())
                _.$label.find('>a').attr("href", "#"+Number(index+1));
                if(selectTrigger) _.$selectbox.trigger( 'change', {selectedIndex:_.$selectbox[0].selectedIndex} ); 
            },
            refresh : function(selectTrigger){
                var _ = this;
                _.$option = _.$selectbox.find('option');
                _._create(selectTrigger)
            },
            selected : function(val){
                var _ = this,
                    selectTrigger = true;
                forEach.call(_.$option, function (item, i) {
                    item.selected = false;
                    if(item.value === val || item.label === val ||  item.index === parseInt(val, 10) ){
                        item.selected = true;
                    }
                });
                _.refresh(selectTrigger);
            },
            checkDisabled : function(){
                var _ = this;
                if( _.element.hasClass('disabled') || _.element.hasClass('readonly') ){
                    return true;
                }
                return false;
            }
        })
    ui.plugin(Selectbox);
})(window[LIB_NAME], jQuery);


/**
 * @name modal
 * @selector [data-modules-modal]'
 */
;(function(core, $, undefined){
    var selector   = '[data-modules-modal]',
        forEach = Array.prototype.forEach,
        win = $(window),
        doc = $(document),
        name = 'modal',
        ui = core.ui,
        Widget = ui.Widget,
        Default = {
            backdrop: true,
            keyboard: true,
            show: true,
            TRANSITION_DURATION : 300,
            modalOpen : "ui-modal-open"
        },
        Modal = Widget.extend({
            name : name,
            init : function (element, config){
                var _ = this;
                var options = _.options = $.extend({}, Default, config);
                _.$element = $(element);
                Widget.fn.init.call(_, element, options);
                _.$body = $(document.body);
                _.$dialog = this.$element.find('.modal-dialog');
                _.$backdrop = null;
                _.isShown = null;
                _.originalBodyPad = null;
                _.scrollbarWidth = 0;
                _.ignoreBackdropClick = false;
                _.fixedContent = '.navbar-fixed-top, .navbar-fixed-bottom';
                
            },


            toggle : function (_relatedTarget) {
                var _ = this;
                return _.isShown ? _.hide() : _.show(_relatedTarget)
            },
            show : function (_relatedTarget) {
                var _ = this;
                var e = $.Event('show.hui.modal', { relatedTarget: _relatedTarget })
            
                _.$element.trigger(e)
            
                if (_.isShown || e.isDefaultPrevented()) return
            
                _.isShown = true
            
                _.checkScrollbar()
                _.setScrollbar()
                _.$body.addClass(_.options.modalOpen)
            
                _.escape()
                _.resize()
                core.ui.modulesRefresh(_.$element);
                _.$element.on('click.dismiss.hui.modal', '[data-dismiss="modal"]', $.proxy(_.hide, _))
            
                _.$dialog.on('mousedown.dismiss.hui.modal', function () {
                    _.$element.one('mouseup.dismiss.hui.modal', function (e) {
                        if ($(e.target).is(_.$element)) _.ignoreBackdropClick = true
                    })
                })
            
                _.backdrop(function () {
                    var transition = $.support.transition && _.$element.hasClass('fade')
                
                    if (!_.$element.parent().length) {
                        _.$element.appendTo(_.$body) // don't move modals dom position
                    }
            
                    _.$element
                        .show()
                        .scrollTop(0)
                
                        _.adjustDialog()
            
                    if (transition) {
                        _.$element[0].offsetWidth // force reflow
                    }
            
                    _.$element.addClass('in')
                
                    _.enforceFocus()
            
                    var e = $.Event('shown.hui.modal', { relatedTarget: _relatedTarget })
            
                    transition ?
                    _.$dialog // wait for modal to slide in
                        .one('bsTransitionEnd', function () {
                            _.$element.trigger('focus').trigger(e)
                        })
                        .emulateTransitionEnd(_.options.TRANSITION_DURATION) :
                        _.$element.trigger('focus').trigger(e)
                    })
            },
            hide : function (e) {
                var _ = this;
                if (e) e.preventDefault()
            
                e = $.Event('hide.hui.modal')
            
                _.$element.trigger(e)
            
                if (!_.isShown || e.isDefaultPrevented()) return
            
                _.isShown = false
            
                _.escape()
                _.resize()
            
                $(document).off('focusin.hui.modal')
            
                _.$element
                    .removeClass('in')
                    .off('click.dismiss.hui.modal')
                    .off('mouseup.dismiss.hui.modal')
            
                    _.$dialog.off('mousedown.dismiss.hui.modal')
            
                $.support.transition && _.$element.hasClass('fade') ?
                _.$element
                        .one('bsTransitionEnd', $.proxy(_.hideModal, _))
                        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
                        _.hideModal()
            },
            enforceFocus : function () {
                var _ = this;
                $(document)
                    .off('focusin.hui.modal') // guard against infinite focus loop
                    .on('focusin.hui.modal', $.proxy(function (e) {
                        if ( document !== e.target && _.$element[0] !== e.target && !_.$element.has(e.target).length) {
                            _.$element.trigger('focus')
                        }
                    }, _))
            },            
            escape : function () {
                var _ = this;
                if (_.isShown && _.options.keyboard) {
                    _.$element.on('keydown.dismiss.hui.modal', $.proxy(function (e) {
                        e.which == 27 && _.hide()
                    }, _))
                } else if (!_.isShown) {
                    _.$element.off('keydown.dismiss.hui.modal')
                }
            },            
            resize : function () {
                var _ = this
                if (_.isShown) {
                    $(window).on('resize.hui.modal', $.proxy(_.handleUpdate, _))
                } else {
                    $(window).off('resize.hui.modal')
                }
            },            
            hideModal : function () {
                var _ = this
                _.$element.hide()
                _.backdrop(function () {
                    _.$body.removeClass(_.options.modalOpen)
                    _.resetAdjustments()
                    _.resetScrollbar()
                    _.$element.trigger('hidden.hui.modal')
                })
            },            
            removeBackdrop : function () {
                var _ = this
                _.$backdrop && _.$backdrop.remove()
                _.$backdrop = null
            },            
            backdrop : function (callback) {
                var _ = this
                var animate = _.$element.hasClass('fade') ? 'fade' : ''
                var zIndex = (1030 + (10 * $('.ui-modal-backdrop').length));
                if (_.isShown && _.options.backdrop) {
                    var doAnimate = $.support.transition && animate
            
                    _.$backdrop = $(document.createElement('div'))
                        .addClass('ui-modal-backdrop ' + animate)
                        .css('z-index', zIndex)
                        .appendTo(_.$body)
                    _.$element.css('z-index', zIndex+1)
                    .on('click.dismiss.hui.modal', $.proxy(function (e) {
                        if (_.ignoreBackdropClick) {
                            _.ignoreBackdropClick = false
                            return
                        }
                        if (e.target !== e.currentTarget) return
                        _.options.backdrop == 'static' ? _.$element[0].focus() : _.hide()
                    }, _))
            
                    if (doAnimate) _.$backdrop[0].offsetWidth // force reflow
            
                    _.$backdrop.addClass('in')
                
                    if (!callback) return
            
                    doAnimate ?
                    _.$backdrop
                        .one('bsTransitionEnd', callback)
                        .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback()
            
                } else if (!_.isShown && _.$backdrop) {
                    _.$backdrop.removeClass('in')
                
                    var callbackRemove = function () {
                        _.removeBackdrop()
                        callback && callback()
                    }
                    $.support.transition && _.$element.hasClass('fade') ?
                    _.$backdrop
                        .one('bsTransitionEnd', callbackRemove)
                        .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                        callbackRemove()
            
                } else if (callback) {
                    callback()
                }
            },             
            handleUpdate : function () {
                this.adjustDialog()
            },
            
            adjustDialog : function () {
                var _ = this;
                var modalIsOverflowing = _.$element[0].scrollHeight > document.documentElement.clientHeight
            
                _.$element.css({
                    paddingLeft: !_.bodyIsOverflowing && modalIsOverflowing ? _.scrollbarWidth : '',
                    paddingRight: _.bodyIsOverflowing && !modalIsOverflowing ? _.scrollbarWidth : ''
                })
                // core.ui.disableScroll();
            },
            
            resetAdjustments : function () {
                var _ = this;
                _.$element.css({
                  paddingLeft: '',
                  paddingRight: ''
                })
                core.ui.enableScroll();
            },
            checkScrollbar : function () {
                var _ = this;
                var fullWindowWidth = window.innerWidth
                if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
                    var documentElementRect = document.documentElement.getBoundingClientRect()
                    fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
                }
                _.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
                _.scrollbarWidth = _.measureScrollbar()
            },            
            setScrollbar : function () {
                var _ = this;
                var bodyPad = parseInt((_.$body.css('padding-right') || 0), 10)
                _.originalBodyPad = document.body.style.paddingRight || ''
                var scrollbarWidth = _.scrollbarWidth
                if (_.bodyIsOverflowing) {
                    _.$body.css('padding-right', bodyPad + scrollbarWidth)
                    $(_.fixedContent).each(function (index, element) {
                        var actualPadding = element.style.paddingRight
                        var calculatedPadding = $(element).css('padding-right')
                        $(element)
                            .data('padding-right', actualPadding)
                            .css('padding-right', parseFloat(calculatedPadding) + scrollbarWidth + 'px')
                    })
                }
            },            
            resetScrollbar : function () {
                var _ = this;
                _.$body.css('padding-right', _.originalBodyPad)
                $(_.fixedContent).each(function (index, element) {
                    var padding = $(element).data('padding-right')
                    $(element).removeData('padding-right')
                    element.style.paddingRight = padding ? padding : ''
                })
            },
            measureScrollbar : function () { // thx walsh
                var _ = this;
                var scrollDiv = document.createElement('div')
                scrollDiv.className = 'modal-scrollbar-measure'
                _.$body.append(scrollDiv)
                var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
                _.$body[0].removeChild(scrollDiv)
                return scrollbarWidth
            }
        })
    ui.plugin(Modal);

    core.customAlert = function(obj){
		var DEFAULTS = {
				root : $(document.body),
				type : 'alert',
				size : "modal-sm",
				title : null,
				defaultBtn : '<button type="button" id="customMsgSubmit" class="btn">확인</button>',
				cancelBtn : '<button type="button" id="customMsgCancel" class="btn">취소</button>',
				message : "",
				defaultCallback : null,
				cancelCallback : null,
				dismissCallback : null,
				btnClicked : false
			},
            options = $.extend({}, DEFAULTS, obj),
            btns = (options.type.indexOf('confirm') != -1) ? options.cancelBtn + options.defaultBtn : options.defaultBtn,
            modal = $('<div id="customAlertModal" class="ui-modal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" />'),
            modalHTML = '';
        
		// 버튼이 텍스트만 전달받을 경우 버튼으로 만들어줌.
		options.defaultBtn = (options.defaultBtn.indexOf('<') != -1) ? 
			options.defaultBtn : '<button type="button" id="customMsgSubmit" class="btn">'+options.defaultBtn+'</button>';
		options.cancelBtn = (options.cancelBtn.indexOf('<') != -1) ? 
			options.cancelBtn : '<button type="button" id="customMsgCancel" class="btn">'+options.cancelBtn+'</button>';
        
		// 모달 구조 생성
		
        modalHTML += '<div class="ui-modal-dialog '+options.size+'" role="document">\
					<div class="modal-content">';

        // 타이틀이 있을 경우 구조 생성
        modalHTML += (options.title !== null)? '<div class="modal-header">\
                <p class="modal-title">'+options.title+'</p>\
            </div>' : '';
        
        // 기본 모달컨텐츠 생성
        modalHTML +='<div class="modal-body">'+options.message+'</div>\
                            <div class="modal-footer">'+btns+'</div>\
                        </div>\
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>\
                    </div>';		
        modal.addClass(options.type).append(modalHTML);
        modal.modal().show()
        // 기본 버튼 클릭 시 콜백
		modal.one('click.customAlert', '#customMsgSubmit', function (e) {
			var $this = $(this);
			var callback;
			options.btnClicked = true;
			if(options.defaultCallback) callback = options.defaultCallback(e);
			if (callback === false) return false;
			$this.closest('[role="dialog"]').modal().hide();
			
		})
		// 취소 버튼 클릭 시 콜백
		.one('click.customAlert', '#customMsgCancel', function (e) {
			var $this = $(this);
            var callback;
			options.btnClicked = true;
            if(options.cancelCallback) callback = options.cancelCallback(e);
            
			if (callback === false) return false;
			$this.closest('[role="dialog"]').modal().hide();
        })
		.one('hidden.hui.modal', function (e) {
			let callback;
			if(!options.btnClicked && options.dismissCallback) callback = options.dismissCallback(e);
            modal.remove().off('customAlert');
		})
	}

    function clickHandler(target, option, el){
        var $target = target;
        var options;
        var btn = el;

        if(!$target.data('modal')){
            options  = $.extend({}, Default, $target.data(), option);
            $target[name](options);
        }
        $target[name]().show(btn);
        return false;
    }



    $(document).on('click.hui.modal.data-api', selector, function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var getDataValue = core.util.cssLiteralToObject($this.attr('data-modules-'+name))
        var target = getDataValue.target ||
          (href && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    
        var $target = $(document).find(target)
        var option = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())
        if ($this.is('a')) e.preventDefault()
    
        $target.one('show.hui.modal', function (showEvent) {
            if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
            $target.one('hidden.hul.modal', function () {
                $this.is(':visible') && $this.trigger('focus')
            })
        })
        clickHandler($target, option, this)
    })
})(window[LIB_NAME], jQuery);

/**
 * @name window popup
 * @selector [data-modules-winpopup]'
 */
;(function(core, $, undefined){
    var selector   = '[data-modules-winpopup]',
        name = 'winpopup';
    $(document).on('click.hui.winpopup.data-api', selector, function (e) {
        e.preventDefault();
        var $this = $(this),
            options =  core.util.cssLiteralToObject($this.attr('data-modules-'+name)),
            href = options.href || $this.attr('href')
        if(!href && href === ""){
            throw new Error("href값은 필수 입니다.");;
        }
        core.util.openPopup(href, options)
    })
    .on('click.hui.winpopup.data-api', '#popWin [data-dismiss="window"]', function(){
        window.close();        
    })
    // .on('click.hui.winpopup.data-api', '#popWin [data-target="_blank"]', function(){
    //     parent.window.open("about:blank")
    // })
})(window[LIB_NAME], jQuery);


/**
 * @name scrollspy
 * @selector [data-modules-scrollspy]'
 */
;(function(core, $, undefined){
    "use strict";
    var win = $(window),
    template = '<a href="javascript:;" class="btn-more"><i class="icon"></i><span class="hiding" data-hidingText></span></a>',
    wrapper = '<div class="inset"></div>',
    Default = {
        scrollWrap : $(document),
        nav : null,
        conts : null,
        conts_pos : [],
        nav_pos : {},
        maxHeight : null,
        durration : 200,
        jumpnav : false,
        margin : 0,
        padding : 0,
        openPadding : 0,
        navHeight : null,
        openText : "더보기",
        closeText : "닫기",
        btn : $(template),
        wrapper : null,
        openImportant : null,
        alSize : null
    },
    activeClass = 'fixed',
    name = "scrollspy",
    ui = core.ui,
    Widget = ui.Widget,
    Scrollspy = Widget.extend({
		name : name,
		init : function (element, config){
			var _ = this;
			var options = _.options = $.extend({}, Default, config);
            _.element = $(element);
            _.element.height(_.element.children().height())
			Widget.fn.init.call(_, element, options);
			_.options.nav = _.element.find('.ui-spynav a');
            _.options.conts = [];
            _.options.btn.find('[data-hidingText]').text(_.options.openText)
			_.options.maxHeight = $('body').prop('scrollHeight') - $(window).height();
			_._getContPos();
            if(_.options.navHeight !== null){
                _._setNavHeight();
            }
            if(_.options.alSize !== null && _.options.nav.length % _.options.alSize !== 0  ){
                _._setAlItems();
            }
            console.log()
            _._bindEvent();
        },
        _bindEvent : function(){
            var _ = this;
            var wrap = _.options.scrollWrap;
            // _.options.btn
            _.options.btn.on('click', function(){
                _.spynavToggle();
            })
			$(window).on('load scroll', function(e){
                _._scrollCheck(wrap.scrollTop());
                _.options.maxHeight = $('body').prop('scrollHeight') - $(window).height();
                _._getContPos();
            })
            
            $(window).on('load resize', function(){
				_.options.maxHeight = $('body').prop('scrollHeight') - $(window).height();
				_._getContPos();
            });
            _.options.nav.on('click', function(e){
                e.preventDefault();
                _._getContPos();
                var index = $(this).parent().index();
                _.options.jumpnav = true;
				$('html, body').stop().animate({scrollTop : _.options.conts[index] +1}, _.options.durration, function(){
                    _.options.jumpnav = false;
                    $(window).trigger('scroll');
                });
				return false;
			});
        },
        _scrollCheck : function (pos){
            const _=this;
            // console.log(pos)
			let max = _.options.conts.length,
				i;
			// 스크롤 위치 별 인덱스 반환
			for (i = 0 ; i < max ; i++){
				if (_.options.conts[i] >= pos) {
					i-=1;
					break;
				}
			};
			if(!_.options.jumpnav){
                if (i == max || (_.options.maxHeight) <= pos){
                    _._activesNav(max-1);
                }else{
                    if(i >= 0){
                        _._activesNav(i);
                    }else if(i < 0){
                        _._activesNav(0);
                    }
                }    
            }
            _._navPos(pos);
            
        },
        _navPos : function (pos){
			var _ = this;
            var navPos = _.element.offset().top - _.options.margin;
			if (pos >= navPos ) {
                _.element.addClass('fixed');
			}else{
				_.element.removeClass('fixed');
			}
        },
        _activesNav : function (n){
            var _ = this;
			var navLists = _.options.nav.parent('li'),
                activeIndex = _.options.nav.parent('li.ui-active').index(),
                pos = navLists.eq(n).position().top + navLists.eq(n).height();
                
            if( _.options.navHeight !== null &&  pos > _.options.navHeight && !_.element.hasClass('ui-active') ){
                _.spynavToggle();
                _.options.openImportant = true;
            }else{
                _.options.openImportant = false;
            }
			if (activeIndex != n && activeIndex == -1){
				navLists.eq(n).addClass('ui-active');
			}else if(activeIndex != n){
				navLists.eq(n).addClass('ui-active');
				navLists.eq(activeIndex).removeClass('ui-active');
			};
		},
        _getContPos : function () {
			var _ = this;
			_.options.conts = [];
            _.options.nav.each(function(n){
                _.options.conts.push($(this.hash))
            })
            for (var i = 0; i < _.options.conts.length; i++) {
                var pos = _.options.conts[i].offset().top - _.options.padding;
                _.options.conts[i] = pos;
			}
        },
        _setNavHeight : function(){
            var _ = this;
            var innerCont = _.element.find('.ui-spynav');
            
            if(innerCont.outerHeight() > _.options.navHeight){
                _.options.openPadding = innerCont.outerHeight() - _.options.navHeight;
                innerCont.wrap(wrapper);
                _.options.wrapper = _.element.find('.inset');
                _.options.wrapper.css({"height":_.options.navHeight+"px", "overflow":"hidden"})
                _.element.children().append(_.options.btn);
                _.element.height(_.options.navHeight)
            }
        },
        _setAlItems : function(){
            var _ = this;
            var count = _.options.alSize - (_.options.nav.length % _.options.alSize);
            console.log(count)
            var html = "";
            for (var i =0; i < count; i++) {
                html+='<li role="presentation"></li>'
            }
            var target = _.element.find('.ui-spynav')
            target.append(html)
        },
        spynavToggle : function(){
            var _ = this;
            if(_.options.openImportant) return;
            if(_.options.wrapper.height() > _.options.navHeight){
                
                _.options.wrapper.height(_.options.navHeight)
                _.element
                    .removeClass('ui-active')
                    .height(_.options.navHeight);
                _.options.btn.find('[data-hidingText]').text(_.options.openText);
                _.options.padding -= _.options.openPadding;
            }else{
                _.options.wrapper
                    .height('auto')
                    
                _.element
                    .addClass('ui-active')
                    .height(_.options.wrapper.height());
                _.options.btn.find('[data-hidingText]').text(_.options.closeText)
                _.options.padding += _.options.openPadding;
            }
            _._getContPos();
        },
        reposition : function(){
            var _ = this;
            _.element.trigger('scroll');
            _.options.openImportant = false;
            if( _.options.navHeight !== null && _.element.hasClass('ui-active') ){
                _.spynavToggle();
            }
        }
        
	})
    ui.plugin(Scrollspy);
})(window[LIB_NAME], jQuery);


/**
 * @name moreview
 * @selector [data-modules-moreview]'
 */
;(function(core, $, undefined){
    "use strict";
    var win = $(window),
    Default = {
        height : 60,
        openText : "더보기",
        closeText : "닫기",
        hiddenClass : 'ui-hidden'
        
    },
    activeClass = 'ui-active',
    namespace = ".moreview",
    name = "moreview",
    ui = core.ui,
    Widget = ui.Widget,
    Moreview = Widget.extend({
		name : name,
		init : function (element, config){
			var _ = this;
			var options = _.options = $.extend({}, Default, config);
            Widget.fn.init.call(_, element, options);
            _.element = $(element);
            _.create();
        },
        _bindEvents : function (){
			var _ = this;
			var btn = _.element.find('[data-button]');
			btn.on('click'+namespace, function(){
				var $this = $(this);
				if(_.element.hasClass(activeClass)){
					_.element.removeClass(activeClass);
					$this.find('>.ui-text').text(_.options.openText);
				}else{
					_.element.addClass(activeClass);
					$this.find('>.ui-text').text(_.options.closeText);
				}
			})
        },
        create : function(){
            var _ = this;
            var btn = _.element.find('[data-button]');
            btn.off(namespace);
            _.element.removeClass(_.options.hiddenClass);
            setTimeout(function(){
                if(_.element.find('.ui-inset').outerHeight()>_.options.height){
                    _.element.addClass(_.options.hiddenClass);
                    _._bindEvents()
                }
            }, 0)
            
        }
	})
    ui.plugin(Moreview);
})(window[LIB_NAME], jQuery);


/**
 * @name starRating
 * @selector [data-modules-starRating]'
 */
;(function(core, $, undefined){
    "use strict";
    var win = $(window),
    forEach = Array.prototype.forEach,
    Default = {
        fixedClass : 'fix',
        score : 1
    },
    activeClass = 'ui-active',
    name = "starRating",
    ui = core.ui,
    Widget = ui.Widget,
    StarRating = Widget.extend({
		name : name,
		init : function(element, config){
			var _ = this;
			
			var options = _.options = $.extend({}, Default, config);
			Widget.fn.init.call(_, element, options);
			_.element = $(element);
			var items = _.element.find('>.star');
			_.options.itemPosition = [];
			_.options.activeIndex = 0;
			_.options.isTouch = core.detect.isTouch;
			forEach.call(items, function (item, i) {
				_.options.itemPosition.push(item.offsetLeft);
				if($(item).hasClass(_.options.fixedClass)){
					_.options.activeIndex = $(item).index();
				}
			})

			_._bindEvents()
		},
		_bindEvents : function(){
			var _ = this;
			if (_.options.isTouch) {
				_.element.on("touchstart", function(e){
					e.preventDefault();
				})
				.on("touchmove", function(e){
					e.preventDefault();
					var target= $(this).find('>.star');
					var pageX = e.touches[0].pageX - this.offsetLeft;
					_._getPageX(pageX);
				})
				.on("touchend", function(e){
					e.preventDefault();
					var target = $(this).find('>.star'),
						pageX = e.originalEvent.changedTouches[0].pageX - this.offsetLeft,
						index = _._getPageX(pageX);
					target.removeClass(_.options.fixedClass);
					target.eq(index).addClass(_.options.fixedClass);
				})
			}else{
				_.element.on("mouseenter", '.star', function(e){
					e.preventDefault();
					var target = $(this),
						index = target.index();
					_.rating(index);
				})
				.on("mouseleave", function(e){
					e.preventDefault();
					var targetIndex = $(this).find('>.star.fix').index();
					_.rating(targetIndex);
				})
				.on("click", '.star', function(e){
					e.preventDefault();
					var target = $(this);
					target.siblings().removeClass(_.options.fixedClass);
					target.addClass(_.options.fixedClass)
				});
			}			
		},
		_getPageX : function(x){
			var _ = this;
			var i;
			for (i = 0; i < _.options.itemPosition.length; i++) {
				var maxIndex = i+1;
				if( _.options.itemPosition[i] <= x && _.options.itemPosition[maxIndex] >= x){
					_.rating(i);
					break;
				}else if(i >= _.options.itemPosition.length-1){
					_.rating(i);
					break;
				}else if(x <= 0){
					_.rating(0);
					break;
				}
			}
			return i;
		},
		rating : function(index){
			var _ = this;
			var target = _.element.find('>.star'),
				scoreTxt = _.element.find('>.num');
			forEach.call(target, function (item, i) {
				if (index >= i ){
					_.options.activeIndex = i;
                    item.classList.add(activeClass);
                    if(_.options.score < 1){
                        scoreTxt.text(parseFloat(_.options.score*(i+1)).toFixed(1))
                    }else{
                        scoreTxt.text(parseInt(_.options.score*(i+1)))
                    }
					
				}else{
					_.options.activeIndex = i;
					item.classList.remove(activeClass);
				}
			})
		}
	})
    ui.plugin(StarRating);
})(window[LIB_NAME], jQuery);


/**
 * @name menus
 * @selector [data-modules-menus]'
 */
// $('[data-modules-menus]').menus('create')
;(function(core, $, undefined){
    "use strict";
    var win = $(window),
    forEach = Array.prototype.forEach,
    activeClass = 'ui-active',
    Default = {
        buttomAlign: true,
        activeClass : activeClass
    },
    
    name = "menus",
    namespace = ".menus",
    ui = core.ui,
    Widget = ui.Widget,
    Menus = Widget.extend({
		name : name,
		init : function(element, config){
			var _ = this;
			
			var options = _.options = $.extend({}, Default, config);
			Widget.fn.init.call(_, element, options);
            _.element = $(element);
			_._bindEvents();
		},
		_bindEvents : function(){
            var _ = this;
            _.element.off(namespace).on('mouseenter'+namespace, '[data-menu]', function(e){
                var $this = $(this);
                var target = $this.find(' > [data-submenu]');
                if(target.length > 0){
                    $this.addClass(_.options.activeClass);
                    if(_.options.buttomAlign){
                        _.setPos(target);
                    }                    
                }
            })
            .on('mouseleave'+namespace, '[data-menu]', function(e){
                var $this = $(this);
                var target = $this.find(' > [data-submenu]');
                if(target.length > 0){
                    $this.removeClass(_.options.activeClass);
                    target.removeAttr('style');
                }
            })
        },
        setPos : function(target){
            var _ = this;
            var height = _.element.offset().top +  _.element.outerHeight();
            var menuHeight = target.offset().top + target.outerHeight();
            if(height < menuHeight){
                target.css({"transform":"translateY("+(height - menuHeight)+"px)"})
            }
        }

	})
    ui.plugin(Menus);
})(window[LIB_NAME], jQuery);



/**
 * @name classesToggle
 * @selector [data-modules-classesToggle]'
 */
// $('[data-modules-classesToggle]').toggleClass('create')
;(function(core, $, undefined){
    "use strict";
    var win = $(window),
    forEach = Array.prototype.forEach,
    Default = {},
    name = "classesToggle",
    namespace = ".classesToggle",
    ui = core.ui,
    Widget = ui.Widget,
    ClassesToggle = Widget.extend({
		name : name,
		init : function(element, config){
			var _ = this;
			var options = _.options = $.extend({}, Default, config);
			Widget.fn.init.call(_, element, options);
            _.element = $(element);
            _.options.classLists = _.options.classLists.split("|")
            _._bindEvents();
		},
		_bindEvents : function(){
			var _ = this;
			_.element.on("click", _.toggleClasses.bind(_))
        },
        toggleClasses : function(e){
            alert();
            e.preventDefault();
            var _ = this,
                $this = _.element[0],
                classes = $this.classList,
                count = _._checkClass(classes);
            if(_.options.classLists.length === 0) return false;
            if (_.options.classLists.length === 1){
                _._toggleClass($this);
            }else{
                if(count === _.options.classLists.length-1){
                    $this.classList.remove(_.options.classLists[_.options.classLists.length-1]);
                    $this.classList.add(_.options.classLists[0]);
                }else if(count === null){
                    $this.classList.add(_.options.classLists[0]);
                }else{
                    $this.classList.remove(_.options.classLists[count]);
                    $this.classList.add(_.options.classLists[count+1]);	
                }
            }
        },
		_toggleClass : function(el){
			var _ = this;
			el.classList.toggle(_.options.classLists[0]);
		},
		_checkClass : function(classLists){
			var _ = this;
			var count = -1;
			for (var i = 0; i < classLists.length; i++) {
				for (var j = 0; j < _.options.classLists.length; j++) {
					if(classLists[i] == _.options.classLists[j]){
						count = j;
						break;
					}else{
						count = null;
					}
				}
			}
			return count;
		}
    })
    ui.plugin(ClassesToggle);
})(window[LIB_NAME], jQuery);


/**
 * @name scrollTab
 * @selector [data-modules-scrollTab]'
 */
;(function(core, $, undefined){
    "use strict";
    var win = $(window),
    forEach = Array.prototype.forEach,
    template = '<div class="scrolltab-btns">\
        <button type="button" class="tab-control prev-tab"><span>이전</span></button>\
        <button type="button" class="tab-control next-tab"><span>다음</span></button>\
    </div>',
    Default = {
        class : null,
        activeIndex : 0,
        activity : null,
        prevDisabled : 'prev-disabled',
        nextDisabled : 'next-disabled',
        innerPadding : 0,
        type : 'tab',
        speed : 300,
        align:'left',
        btns : template
    },
    name = "scrollTab",
    namespace = ".scrollTab",
    activeClass = 'ui-active',
    ui = core.ui,
    Widget = ui.Widget,
    ScrollTab = Widget.extend({
		name : name,
		init : function(element, config){
			var _ = this;
			var options = _.options = $.extend({}, Default, config);
			Widget.fn.init.call(_, element, options);
            _.element = $(element);
            _.element.wrap('<div class="scroll-tab '+((_.options.class)?_.options.class:'')+'"><div class="inner-scroll"></div></div>');
            _.options.wrap = _.element.closest('.scroll-tab');
			_.options.inner = _.element.closest('.inner-scroll');
            _.options.tablist = _.element.find('[role="presentation"]');
            _.options.wrap.append(_.options.btns);
            _.options.wrapperPadding = parseInt(_.options.wrap.css('padding-left')) + parseInt(_.options.wrap.css('padding-right'));
            _._bindEvents();
            _.isActive();
            _._checkBtn()
            // 링크 타입일 경우 처리
            if(_.options.tablist.find('a[data-modules-tab]').length === 0){
                _.options.type = 'link';
            }
		},
		_bindEvents : function(){
			var _ = this;
			$(window).on('resize'+namespace +' load'+namespace, function(){
                // _.refresh()
                // _.isActive();
            });
            _.options.wrap.on('shown.hui.tab', 'a[data-modules-tab]', function(){
				_.options.activeIndex = $(this).closest('li').index();
                _._checkBtn();
                if(_.options.align === 'center'){
                    _._actionsCenter();
                }else{
                    _._actionsLeft();
                }
			})
			_.options.wrap.on('click'+namespace +' dbclick'+namespace, 'button.tab-control:not(".disabled")', function(){
                var $this = $(this);
                // 기본 확장 텝
                if(_.options.type === 'tab'){
                    if ($this.hasClass('prev-tab') && _.options.activeIndex > 0 ) {
                        _.options.activeIndex = _.options.activeIndex-1	
                    }else if($this.hasClass('next-tab') && _.options.activeIndex < _.options.tablist.length){
                        _.options.activeIndex = _.options.activeIndex+1
                    }
                    _.options.tablist.eq(_.options.activeIndex).children('a').tab('show');

                // 변형 케이스 링크 클릭 인 경우
                }else if(_.options.type === 'link'){
                    if ($this.hasClass('prev-tab')) {
                        
                        if((_.options.activeIndex - _.options.align ) >= 0){
                            _.options.activeIndex = _.options.activeIndex - _.options.align;
                            // 첫번째 슬라이드 체크
                            if( _.options.activeIndex < _.options.align ) {
                                _.options.activeIndex = 0
                            }
                        }
                    }else if($this.hasClass('next-tab')){
                        if((_.options.activeIndex + _.options.align ) < _.options.tablist.length){
                            _.options.activeIndex = _.options.activeIndex + _.options.align;
                            // 마지막 슬라이드 체크
                            if( (_.options.tablist.length - 1 - _.options.activeIndex ) < _.options.align ) {
                                _.options.activeIndex = _.options.tablist.length -1
                            }
                        }
                    }
                    _._actionsLeft();
                }
                
                
                console.log();
                _._checkBtn()
			});
        },
        _checkBtn: function(){
            var _ = this;
            if(!_.options.activity) return;
			if(_.options.activeIndex == 0){
				_.options.wrap.find('.tab-control').removeClass('disabled');
				_.options.wrap.find('.prev-tab').addClass('disabled');
				_.options.wrap.removeClass(_.options.nextDisabled).addClass(_.options.prevDisabled);
			}else if(_.options.activeIndex == (_.options.tablist.length-1)){
				_.options.wrap.find('.tab-control').removeClass('disabled');
                _.options.wrap.find('.next-tab').addClass('disabled');
                _.options.wrap.removeClass(_.options.prevDisabled).addClass(_.options.nextDisabled);
			}else{
                _.options.wrap.find('.tab-control').removeClass('disabled');
                _.options.wrap.removeClass(_.options.prevDisabled).removeClass(_.options.nextDisabled);
			}
		},
        isActive: function(){
            var _ = this,
                tabWidth = 0,
                tabPos = [];
            
            forEach.call(_.options.tablist, function (item, i) {
                if(item.classList.contains(activeClass)) _.options.activeIndex = i;
                if(window.getComputedStyle(item).boxSizing == 'border-box'){
                    tabWidth+= parseFloat(window.getComputedStyle(item).width) + parseFloat(window.getComputedStyle(item).marginLeft) + parseFloat(window.getComputedStyle(item).marginRight);
                }else{
                    tabWidth+= parseFloat(window.getComputedStyle(item).width) + parseFloat(window.getComputedStyle(item).paddingLeft) + parseFloat(window.getComputedStyle(item).paddingRight) + parseFloat(window.getComputedStyle(item).borderLeftWidth) + parseFloat(window.getComputedStyle(item).borderRightWidth) + parseFloat(window.getComputedStyle(item).marginLeft) + parseFloat(window.getComputedStyle(item).marginRight);
                }
                tabPos.push(tabWidth)
            });
            _.element.css('width', tabWidth + 'px');
            
            if(tabWidth > _.options.inner.outerWidth()){
                _.options.wrap.addClass(activeClass);
                _.options.activity = true;
                // if(_.options.type === 'link'){
                    for (var j = 0; j < tabPos.length; j++) {
                        if(tabPos[j] > _.options.inner.outerWidth()){
                            _.options.align = j
                            break;
                        }
                    }
                // }
                
            }else{
                _.options.wrap.removeClass(activeClass);
                _.options.activity = false;
            }
        },
        _actionsLeft: function(){            
			var _ = this,
			    ini = _.options.inner,
			    el = _.options.tablist.eq(_.options.activeIndex),
			    contsWidth = ini.width() - (_.options.innerPadding *2),
			    scr = ini[0].scrollLeft,
                elPos = Math.ceil(el.position().left + el.width());
			if (_.options.activity) {
				if ((elPos) > contsWidth + _.options.innerPadding ){
                    ini.animate({scrollLeft: scr + el.position().left  - _.options.innerPadding}, _.options.speed);                    
					return;
				}else if(el.position().left < _.options.innerPadding){
                    ini.animate({scrollLeft: scr - contsWidth  - _.options.innerPadding - _.options.wrapperPadding  + el.position().left + el.outerWidth()}, 300);
					return;
                };
			}
        },
        _actionsCenter: function(){
			var _ = this,
			    ini = _.options.inner,
			    el = _.options.tablist.eq(_.options.activeIndex),
			    contsWidth = ini.width(),
			    scr = ini[0].scrollLeft,
                elPos = Math.ceil(el.position().left + el.width()),
                center = (contsWidth - el.width())/2,
                scrollPos = el.position().left - center + scr
            ini.animate({scrollLeft: scrollPos}, _.options.speed);
        },
		refresh: function(){
			const _ = this;
			_.options.tablist = _.element.find('[role="presentation"]');
			_.isActive();
			_._actions();
		}
    })
    ui.plugin(ScrollTab);
})(window[LIB_NAME], jQuery);

/**
 * @name tooltip
 * @selector [data-modules-scrollTab]'
 */

;(function(core, $, undefined){
    "use strict";
    var win = $(window),
    forEach = Array.prototype.forEach,
    closeBtnTemplate = '<button class="btn-close"><i class="icon"></i><span class="hiding">닫기</span></button>',
    Default = {
        type : 'click', // click | hover
        href : null,
        closeBtn : true,
        toggle : false
    },
    name = "tooltip",
    namespace = ".tooltip",
    activeClass = 'ui-active',
    ui = core.ui,
    Widget = ui.Widget,
    Tooltip = Widget.extend({
		name : name,
		init : function(element, config){
			var _ = this;
			var options = _.options = $.extend({}, Default, config);
			Widget.fn.init.call(_, element, options);
            _.element = $(element);
            _.selector = $(_.element.attr('href'));
            if (!_.element.attr('href') && _.options.href !== null) _.selector = $(_.options.href);
            
            if(_.options.closeBtn) _._setCloseBtn();

            _._bindEvents();
		},
		_bindEvents : function(){
            var _ = this;
            switch (_.options.type) {
                case 'click':{
                    _.element.on('click'+namespace, _.show.bind(_))
                    break;
                }
                case 'hover':{
                    _.element.on('mouseenter'+namespace, _.show.bind(_))
                    _.element.on('mouseleave'+namespace, _.hide.bind(_))
                    _.selector.on('mouseenter'+namespace, _.show.bind(_))
                    _.selector.on('mouseleave'+namespace, _.hide.bind(_))
                    break;
                }
                default:{
                    break;
                }
            }
            
            _.selector.on('click'+namespace, '.btn-close', _.hide.bind(_))
        },
        show : function(e){
            var _ = this;
            e.preventDefault();
            if(_.options.toggle && _.element.hasClass(activeClass)){
                _.hide();
                return;
            }
            _.element.addClass(activeClass);
            _.selector.addClass(activeClass);
        },
        hide : function(){
            var _ = this;
            _.element.removeClass(activeClass);
            _.selector.removeClass(activeClass);
        },
        _setCloseBtn : function(){
            var _ = this;
            _.selector.append(closeBtnTemplate)
        }
    })
    ui.plugin(Tooltip);
})(window[LIB_NAME], jQuery);


/**
 * @name scrollItems
 * @selector [data-modules-scrollItems]'
 */

;(function(core, $, undefined){
    "use strict";
    var win = $(window),
    forEach = Array.prototype.forEach,
    Default = {
        align: 0,
        activeClass : 'ui-active',
        scrollToShow : 1,
        btnControl : false
    },
    template = '<div class="scrollitems-btns">\
        <button type="button" class="ui-item-control prev-tab"><span>이전</span></button>\
        <button type="button" class="ui-item-control next-tab"><span>다음</span></button>\
    </div>',
    name = "scrollItems",
    namespace = ".scrollItems",
    activeClass = 'ui-active',
    isApp = core.detect.isApp,
    ui = core.ui,
    Widget = ui.Widget,
    ScrollItems = Widget.extend({
		name : name,
		init : function(element, config){
			var _ = this;
			var options = _.options = $.extend({}, Default, config);
			Widget.fn.init.call(_, element, options);
            _.element = $(element);
            _.wrap;
            _.btns = null;
            _.index = null;
            _.activeIndex = 0;
            _.options.activeClass = (_.options.activeClass !== undefined) ?_.options.activeClass:activeClass
            if(_.options.btnControl){
                _.element.wrap("<div class='ui-scitems-wrap' />");
                _.wrap = _.element.closest('.ui-scitems-wrap');
                _.wrap.append(template);
                _.btns = _.wrap.find('.scrollitems-btns');
                _.index = 0;
            }
            // console.log(_.options.activeClass);
            _._bindEvents();
		},
		_bindEvents : function(){
            var _ = this;
            
            !_.btns || _.btns.on('click dbclick', '.ui-item-control', function(){
                var $this = $(this);
                var prevBtn = $this.hasClass('prev-tab');
                if(prevBtn && _.wrap.hasClass('prev-disabled')){
                    // console.log('first');
                    return;
                }else if(!prevBtn && _.wrap.hasClass('next-disabled')){
                    // console.log('last');
                    return;
                }
                if(prevBtn){
                    _.index--
                }else{
                    _.index++
                }
                _.goActive(_.index * _.options.scrollToShow)
            })
            _.element.on('click', '.ui-nav', _.activeItem.bind(_))
            .on('scroll', function(){
                
                var $this = $(this);
                var scrollLeft = $this.scrollLeft();
                // console.log('ddd'+scrollLeft);
                var wrap = _.wrap || $this; 
                if(scrollLeft === 0){
                    console.log('set');
                    wrap.addClass('prev-disabled');
                }else if(Math.round(scrollLeft + $this[0].offsetWidth) >= $this[0].scrollWidth){
                    console.log('end');
                    wrap.addClass('next-disabled');
                }else{
                    wrap.removeClass('prev-disabled');
                    wrap.removeClass('next-disabled')
                }
            })
            .on('touchstart', function(){
                if(isApp && window.AndroidJS !== undefined) window.AndroidJS.setPagingDrag("false");
            })
            .on('touchend', function(){
                if(isApp && window.AndroidJS !== undefined) window.AndroidJS.setPagingDrag("true");
            })
            .trigger('scroll')

            setTimeout(function(){
                var initEvent = $.Event('init'+namespace, {
                    relatedTarget: _.element.find('.ui-nav'+'.'+activeClass)
                })
                _.element.trigger(initEvent);
                _.initActiveItem();
            },0)
        },
        activeItem : function(e){
            var _ = this,
                $this = $(e.currentTarget),
                eType = e.type,
                activeEvent = $.Event('active'+namespace, {
                    relatedTarget: $this
                });
            $this.activeItem(_.options.activeClass);
            _.element.trigger(activeEvent);
            if(!_.options.btnControl) _.goActive($this.index(), eType);
        },
        initActiveItem : function(){
            var _ = this;
            var index = _.element.find('.ui-nav'+'.'+activeClass).index();
            if(index < 0) return;
            if(_.options.btnControl){
                index = parseInt(index / _.options.scrollToShow);
                _.goActive(index * _.options.scrollToShow );
                _.index = index;
            }else{
                _.goActive(index);
                _.activeIndex = index;
            }

            
            
        },
        goActive : function(n, eType){
            
            var _ = this;
            var $this = _.element.find('.ui-nav').eq(n);
            var duration = 300;
            if(_.activeIndex != $this.index() && !_.btns){   
                $this.activeItem(_.options.activeClass);
                _.activeIndex = n;
            }else if(!_.btns && eType === undefined){
                return;
            }
            if(typeof _.options.align === 'number'){
                _.options.padding = $this.outerWidth() * _.options.align
            }else if(typeof _.options.align === 'string'){
                if(_.options.align === 'center'){
                    _.options.padding = (_.element.outerWidth()/2) - ($this.outerWidth()/2);
                }else if(_.options.align === 'left'){
                    // _.options.padding = 0
                }
            }
            var left = $this.position().left+_.element.scrollLeft()-_.options.padding;
            _.element.stop().animate({scrollLeft:left},duration)
        }
    })
    ui.plugin(ScrollItems);
})(window[LIB_NAME], jQuery);


/**
 * @name imageViewer
 * @selector [data-modules-imageViewer]'
 */

;(function(core, $, undefined){
    "use strict";
    var win = $(window),
    forEach = Array.prototype.forEach,
    Default = {
        zoom: .5,
        magnification : .03,
        activeClass : 'ui-active',
        minimumZoom : .3,
        maximumZoom : 1
    },
    name = "imageViewer",
    namespace = ".imageViewer",
    activeClass = 'ui-active',
    isApp = core.detect.isApp,
    ui = core.ui,
    Widget = ui.Widget,
    ImageViewer = Widget.extend({
		name : name,
		init : function(element, config){
			var _ = this;
			var options = _.options = $.extend({}, Default, config);
			Widget.fn.init.call(_, element, options);
            _.element = $(element);
            _.width = _.element.outerWidth();
            _.height = _.element.outerHeight();
            _.zoom =  _.options.zoom
            _.angleWidth = _.width * _.zoom;
            _.angleHeight = _.height * _.zoom;
            _.rectAngle = $('<div class="ui-angle">');
            _.element.append(_.rectAngle);
            _.isOver = null;
            _.viewercontent = $(document).find('[data-viewercontent]')
            _._bindEvents();
		},
		_bindEvents : function(){
            var _ = this;
            _.element
            .on('mouseenter', function(e){
                _.isOver = true;
                var w = _.angleWidth =_.width * _.zoom;
                var h = _.angleHeight = _.height * _.zoom;
                _._showRectAngle();
                _._setAngleSize(w, h);
            })
            .on('mouseleave', function(e){
                _.isOver = false;
                _._hideRectAngle();
                _.zoom = _.options.zoom
            })
            .on('mousewheel DOMMouseScroll', function(e){
                var wheelPos = e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta / 10 : (e.originalEvent.detail || e.originalEvent.deltaY)/3,
                    x, y;
                if(wheelPos < 0){
                    _.zoom-=_.options.magnification;
                }else{
                    _.zoom+=_.options.magnification;
                }
                if(_.zoom <= _.options.minimumZoom) _.zoom = _.options.minimumZoom;
                if(_.zoom >= _.options.maximumZoom) _.zoom = _.options.maximumZoom;
                var w = _.angleWidth =_.width * _.zoom;
                var h = _.angleHeight = _.height * _.zoom;
                x = _._getPageX(e.pageX);
                y = _._getPageY(e.pageY);
                _._setAngleSize(w, h);
                _._changeAnglePosition(x, y);
                if(_.isOver) return false;
            })

            $(document).on('mousemove', function(e){
                if(!_.isOver) return;
                var x = _._getPageX(e.pageX)
                var y = _._getPageY(e.pageY)
                _._changeAnglePosition(x, y);
            })
        },
        _changeAnglePosition : function(x, y){
            var _ = this;
            _.rectAngle.css({"top":y+"px", "left":x+"px"})
            $('.viewer-image').css({"transform":"translate(-"+x/_.zoom+"px, -"+y/_.zoom+"px)"})
        },
        _showRectAngle : function(){
            var _ = this;
            var src = _.element.find('.slick-active [data-item]').attr('data-outputsrc')
            _.rectAngle.show();
            _.viewercontent.addClass(activeClass);
            _.viewercontent.append('<div class="viewer-image"><img src="'+src+'"></div>');
        },
        _hideRectAngle : function(){
            var _ = this;
            _.rectAngle.hide()
            _.viewercontent.removeClass(activeClass);
            _.viewercontent.find('.viewer-image').remove();
        },
        _setAngleSize : function(w, h){
            var _ = this;
            _.rectAngle.css({"width":w+"px", "height":h+"px"})
            $('.viewer-image').css({"width":(_.width /_.zoom)+"px", "height":(_.height /_.zoom)+"px"})
        },
        _getPageX : function(n){
            var _ = this,
                x = n - _.element.offset().left-4 - (_.angleWidth/2),
                maximun = x + _.angleWidth,
                pos = 0;
            if(x >= 0){
                if(maximun >=_.width){
                    pos = _.width - _.angleWidth;
                }else{
                    pos = n - _.element.offset().left-4 - (_.angleWidth/2)
                }
            }
            return pos;
        },
        _getPageY : function(n){
            var _ = this,
                y = n - _.element.offset().top-4 - (_.angleHeight/2),
                maximun = y + _.angleHeight,
                pos = 0;
            if(y >= 0){
                if(maximun >=_.height){
                    pos = _.height - _.angleHeight;
                }else{
                    pos = n - _.element.offset().top-4 - (_.angleHeight/2)
                }
            }
            return pos;
        }
    })
    ui.plugin(ImageViewer);
})(window[LIB_NAME], jQuery);





/**
 * @name commonUi
 * @selector $('body')
 */
;(function(core, $, undefined){
    "use strict";
    var Default = {
        activeClass : "ui-active",
        subMenuCheckClass : "hasSub",
        activeGnb : null,
        DURATIONS : 500,
        randomBackground: '[data-background]',
        randomClass: '[data-randomclass]'
    },
    doc = $(document),
    forEach = Array.prototype.forEach,
    win = $(window),
    NAME = "commonUi",
    objectProto = Object.prototype,
    hasOwn = objectProto.hasOwnProperty,
    ui = core.ui,
    Widget = ui.Widget,
    LIBRAYLISTS = {
        slick : {
            el : '[data-modules-slick]',
            name : "slick",
            default : {
                arrows:true,
                dots: true,
                infinite: false
            }
        },
        // customScroll : {
        //     el : '[data-modules-customScroll]',
        //     name : "mCustomScrollbar",
        //     default : {
        //         theme:"dark-thin",
        //         scrollInertia:500
        //     }
        // },
        // tooltip : {
        //     el : '[data-modules-tooltip]',
        //     name : "tooltip"
        // },
        // cascadingGrid : {
        //     el : '[data-modules-cascadingGrid]',
        //     name : "cascadingGrid"
        // },
        // classesToggle : {
        //     el : '[data-modules-classesToggle]',
        //     name : "classesToggle"
        // },
        // starRating : {
        //     el : '[data-modules-starRating]',
        //     name : "starRating"
        // },
        
        menus : {
            el : '[data-modules-menus]',
            name : "menus"
        },
        sticky : {
            el : '[data-modules-sticky]',
            name : "sticky"
        },
        customtoggle : {
            el : '[data-modules-customtoggle]',
            name : "customtoggle"
        },
        cascadingGrid : {
            el : '[data-modules-cascadingGrid]',
            name : "cascadingGrid"
        },
        collapse : {
            el : '[data-modules-collapse]',
            name : "collapse"
        },
        tab : {
            el : '[data-modules-tab]',
            name : "tab"
        },
        selectbox : {
            el : '[data-modules-selectbox]',
            name : "selectbox"
        },
        scrollspy : {
            el : '[data-modules-scrollspy]',
            name : "scrollspy"
        },
        moreview : {
            el : '[data-modules-moreview]',
            name : "moreview"
        },
        starRating : {
            el : '[data-modules-starRating]',
            name : "starRating"
        },
        classesToggle : {
            el : '[data-modules-classesToggle]',
            name : "classesToggle"
        },
        scrollTab : {
            el : '[data-modules-scrollTab]',
            name : "scrollTab"
        },
        tooltip : {
            el : '[data-modules-tooltip]',
            name : "tooltip"
        },
        video : {
            el : '[data-modules-video]',
            name : "video"
        },
        scrollItems : {
            el : '[data-modules-scrollItems]',
            name : "scrollItems"
        },
        imageViewer : {
            el : '[data-modules-imageViewer]',
            name : "imageViewer"
        }
        
        // overflowText : {
        //     el : '[data-modules-overflowText]',
        //     name : "overflowText"
        // },
        // jumpTo : {
        //     el : '[data-modules-jumpTo]',
        //     name : "jumpTo"
        // },
        // imageView : {
        //     el : '[data-modules-imageView]',
        //     name : "imageView"
        // }
        
    },
    commonUi = Widget.extend({
		name : NAME,
		init : function (element, config){
			var _ = this;
			var options = _.options = $.extend({}, Default, config);
			_.element = $(element);
			Widget.fn.init.call(_, element, options);
			_.options.progressBar = $('#progressBar');
			_.mediaInfo = core.detect.mediaInfo.mode
			_._bindEvents();
            _.currentImgLoaded(_.mediaInfo);
            _.initLibray();
            _.fullScreenEl = {};
			

			// if(_.element.find('#bannerWrap').length !== 0) _.commonBanner();

			// hash 체크하여 
			if (window.location.hash !== ""){
				_.openTab();
            }
            // console.log($(_.options.randomBackground).length)
            // if($(_.options.randomBackground).length > 0){
            //     _.randomBackground($(_.options.randomBackground));
            // }

            // if($(_.options.randomClass).length > 0){
            //     _.randomClass($(_.options.randomClass));
            // }



            win.on('hashchange', _.openTab);


            // // 대상 node 선택
            // var target = document.getElementById('wrap');
            
            // // 감시자 인스턴스 만들기
            // var observer = new MutationObserver(function(mutations) {
            //     mutations.forEach(function(mutation) {
            //         console.log(mutation);
            //         console.log($(mutation.addedNodes[0]));
            //         $('body').commonUi('initLibray')
            //     });    
            // });
            
            // // 감시자의 설정:
            // // characterData: true,
            // var config = { attributes: true, characterData: true, childList: true, subtree: true };
            
            // // 감시자 옵션 포함, 대상 노드에 전달
            // observer.observe(target, config);



		},
		// hideQuickMenu
		_bindEvents : function (){
			var _ = this;
			win.on('changeSize', function(e, mode){
				_.mediaInfo = mode;
				_.currentImgLoaded(mode);
			});
			win.on('load', function(e){
				_.initLibray();				
            })


			_.element.on('click', '#bgDim', function(e){
				var $this = $(this);
                var target = $this.data('callFn');
                var selector = $('[data-fn-layer].'+_.options.activeClass);
				if(!target) {
					core.ui.hideDim();
					return false;
                };
                

                var method = "hide"+target;
				// if (!hasOwn.call(method, _)) throw new Error("메서드가 존재하지 않습니다.");
				_[method](e, selector);
            });

            // a 링크 안에 있는 버튼 캡쳐
            $('[data-alink-inner]').on('click', function(e){
                var $this = $(this),
                    target = $this.data('alinkInner'),
                    clicker = $(e.target);
                if(clicker.closest('.'+target).length !== 0){
                    alert('자세히 보기')
                    return false;
                }
            })


            // 상품상세 동영상 플로팅 
            $(document)
            .on('click', '[data-btn-top]', function(e){
                e.preventDefault();
                $(document).scrollTop(0);
            })

            // 커스텀 데이터 레이어팝업 호출
            doc.on('click', '[data-fn-layer]', function(e){
                e.preventDefault();
                var $this = $(this);
                var fn = $this.data('fnLayer');
                _[fn](e, $this);
            })
        },
        showAllBrand : function(){
            var _ = this;
            var layer = _.element.find('#allViewLayer');
            layer.show();
        },
        hideAllBrand : function(){
            var _ = this;
            var layer = _.element.find('#allViewLayer');
            layer.hide();
        },
        showSearchLayer: function(e, el){
            var _ = this;
            var $this = el;
            var target = $this.closest('.search-wrap');
            $this.addClass(_.options.activeClass)
            target.addClass(_.options.activeClass);
            core.ui.showDim('SearchLayer');
        },
        hideSearchLayer: function(e, el){
            var _ = this;
            var $this = el;
            var target = $this.closest('.search-wrap');
            $this.removeClass(_.options.activeClass)
            target.removeClass(_.options.activeClass);
            core.ui.hideDim();
        },
		closeLayers : function(elm, layer){

			var _ = this;
			var el = elm;
			var target = layer;
			_["hide"+target](target);
			$('[data-callayer='+target+']').removeClass(_.options.activeClass);
			
		},
        _fixedTab : function(){
            var _ = this;
            var el = _.element.find('#stickyTab');
            var fixedHeader = _.element.find('.header').outerHeight() || 0;
            var videoFloat = _.element.find('#videoFloat').outerHeight() || 0;
            var padding = videoFloat + fixedHeader;
            if(videoFloat > 0) _.element.addClass('in_video_float');
            
            if(el.length !== 0){
                if(el.data('sticky') !== undefined){
                    el.sticky().posRefresh(-(padding));
                }else{
                    el.sticky({
                        padding:-(videoFloat + fixedHeader)
                    })
                }
            }
        },
		openTab : function(){
			var selector = $('a[href="'+window.location.hash+'"]');
			if (selector.data('modulesTab') ==='tab') selector.tab('show');
		},
		initLibray : function(){
			var _ = this;
            var LibrayLists = LIBRAYLISTS;
            var stickyTab = $('#stickyTab');
            if($(_.options.randomBackground).length > 0){
                _.randomBackground($(_.options.randomBackground));
            }

            if($(_.options.randomClass).length > 0){
                _.randomClass($(_.options.randomClass));
            }

            for (var i in LibrayLists) {
                if (LibrayLists.hasOwnProperty(i)) {
                    _.setOptions(LibrayLists[i]);
                }
            }
            

            
            // 모바일 스티키텝 리프래쉬
            if(stickyTab.length !== 0){
                if( stickyTab.data('sticky') !== undefined){
                    stickyTab.sticky('posRefresh');
                }else{
                    _._fixedTab()
                }
            }
            
            return _;
        },
        initLibrary : function(){
			var _ = this;
			_.initLibray();
		},
		setOptions : function(obj){
			/**
			 * @options : enableMode ["web", "tablet", "mobile"];
			 */
			var el = $(obj.el),
				defaultOption = obj.default,
				name = obj.name;
			el.each(function(){
                var $this = $(this);
				var $this = $(this),
                    option = $.extend({}, defaultOption),
                    elOpt = $this.attr('data-modules-'+obj.name),
					options = elOpt !== "" ? $.extend(option, core.util.cssLiteralToObject(elOpt)): option,
					mode = core.detect.mediaInfo.mode,
					setMode = (!options.hasOwnProperty('enableMode')) || (function(options, mode){
						var checkMode = options['enableMode'];
						if (checkMode !== null) {
							checkMode = (checkMode.indexOf(mode) !== -1)? true : false;
							
						}else{
							checkMode = true;
						}
						return checkMode;
                    })(options, mode);
                
				if(!$this.parents('pre').length /* 진행표 소스 보기 용. */ && setMode && !$this.data('active')) {
					$this[name](options);
					$this.data('active', true);	//플러그인 적용 활성화 체크
				}
			});
		},
		currentImgLoaded : function(mode){
			var d = mode,
				lists = [].slice.call(document.querySelectorAll('.current_img'));
			// lists.forEach(el=>{
			// 	var src = el.dataset[mode] || el.dataset['src'];
			// 	el.setAttribute('src', src)
            // });
            lists.forEach(function(el){
				var src = el.dataset[mode] || el.dataset['src'];
				el.setAttribute('src', src)
			});
		},
        listsPaging : function(lists, startIndex, pd){
            var _ = this;
            var list = _.element.find('#prdLists');
            var pages = list.find('#listPaging')
            var max = lists.length;
            var pos = [];
            var index = 0;
            var defaultButtom = pd;
            var namespace = '.paging'
            setPos();
            win.off(namespace)
            win.on('scroll'+namespace, function(e){
                var $this = $(this);
                var top = $this.scrollTop() + $this.outerHeight();
                var bottom = ($('.nav-tabbar.fixed').height() || 0) + defaultButtom;
                pages.data('sticky').options.padding = bottom;
                index = setPaging(top) + startIndex;
                pages.find('.ui-index').text(index);
                pages.css({"bottom":bottom+'px'})
                if(index !== 0){
                    pages
                    .removeClass('hide')
                    .removeClass('hidden');
                } 
            })
            .on("scrollstart"+namespace,function(){
                // console.log('dd');
                // if(index !== 0){
                //     pages
                //     .removeClass('hide')
                //     .removeClass('hidden');
                // } 
            })
            .on("scrollend"+namespace,function(){
                pages.addClass('hide');
            })
            .on('load'+namespace, function(){
                setPos();
            })
            .trigger('scroll'+namespace+' scrollstart'+namespace);

            if(pages.data('sticky') === undefined){
                pages.sticky({
                    align:'bottom',
                    padding: defaultButtom,
                    breakPoint : list
                });
            }else{
                pages.data('sticky').options.padding = defaultButtom;                
            }
            
            function setPos(){
                pos = [];
                lists.each(function(n){
                    var top = $(this).offset().top + $(this).outerHeight();
                    pos.push(top);
                });
                pos.push($(document).outerHeight()+100);
            }

            function setPaging(top){
                var low = 0;
                var high = pos.length -1;
                var scTop = top;
                while(low <= high){
                    var mid = Math.floor((low+high)/2);
                    if( top <= pos[mid] && top >= pos[mid-1] ){
                        return mid;
                    }else if(top < pos[mid]){
                        high = mid - 1;
                        
                    }else{
                        low = mid + 1;
                    }
                }
                return 0;
            }
        },
        randomBackground : function(el){
            var _ = this;
            var target = el;
            forEach.call(target, function (item, i) {
                var $this = $(item)
                var colors = $this.data('background').split('|');
                var index = parseInt(Math.random() * colors.length)
                if($this.css('background-color') === 'rgba(0, 0, 0, 0)') $this.css('background', colors[index])
                
            });
        },
        randomClass : function(el){
            var _ = this;
            var target = el;
            forEach.call(target, function (item, i) {
                var $this = $(item)
                var rClass = $this.data('randomclass').split('|');
                var index = parseInt(Math.random() * rClass.length);
                if($this[0].classList !== '') {
                    forEach.call($this[0].classList, function(item, i){
                        $this.removeClass(rClass[rClass.indexOf($this[0].classList[i])])
                    })
                }
                $this.addClass(rClass[index])
            });
        },
        toggleMenu : function(event,  el){
            var _ = this;
            var selector = el;
            var menu = $('[data-layer-sidemenu]');
            if(menu.hasClass(_.options.activeClass)){
                selector.removeClass(_.options.activeClass)
                menu
                .removeClass(_.options.activeClass);
                core.ui.hideDim();
            }else{
                selector.addClass(_.options.activeClass)
                menu
                .addClass(_.options.activeClass)
                core.ui.showDim('toggleMenu');
            }
        }
    })
    ui.plugin(commonUi);
	document.addEventListener('DOMContentLoaded', function(){
        $('body').commonUi();
        console.log('commonUi')
    });
    // win.on('load', function(){
    //     $('body').commonUi();
    // })
})(window[LIB_NAME], jQuery);
/* 
============================================================== UI 컴포넌트 End
*/




/* UIComponent start ********************************************************************/

/* UIComponent mobile start */

/* UIComponent mobile.slick start */
$.fn.useSlick = function(option){
    var _self = this;
    var $selector = $(this);

    /*
        slick 유형 7가지
    */
    var types = {
        centerauto : {
            dots: false,
            arrows: false,
            autoplay: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            centerMode: true,
            variableWidth: true,
        },
        noncount : {
            dots: false,
            arrows: false,
            autoplay: false,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            centerMode: true,
            variableWidth: true,
        },
        leftalign : {
            dots: false,
            arrows: false,
            autoplay: false,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            centerMode: false,
            variableWidth: true,
        },
        countauto : {
            dots: false,
            arrows: false,
            autoplay: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            centerMode: true,
            variableWidth: true,
        },
        countstop : {
            dots: false,
            arrows: false,
            autoplay: false,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            centerMode: true,
            variableWidth: true,
            adaptiveHeight: true
        },
        totalcurrent : {
            dots: false,
            arrows: false,
            autoplay: false,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            centerMode: true,
            variableWidth: true,
        },
        leftright : {
            dots: true,
            arrows: true,
            autoplay: false,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            centerMode: true,
            variableWidth: true,
        },
        dotpaging : {
            dots: true,
            arrows: false,
            autoplay: false,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            centerMode: true,
            variableWidth: true,
        },
        default : {
            speed: 300,
            slidesToShow: 1,
            centerMode: true,
            variableWidth: true,
        }
    }
    
    var _default = {
        'type' : 'centerauto',
        'footer' : null,
        'useFooter' : true,
        'stopBtn' : '.btn-stop',
        'playBtn' : '.btn-play',
        'speed' : 300,
        'autoplaySpeed' : 5000,
        'onClickPause' : function(e, $stopBtn, $playBtn){
            $stopBtn.toggleClass('active')
            $playBtn.toggleClass('active')
        },
        'onClickPlay' : function(e, $stopBtn, $playBtn){
            $playBtn.toggleClass('active')
            $stopBtn.toggleClass('active')
        },
        //그밖에 slick 옵션 추가 가능
    }

    var _option = $.extend({}, _default, types[option ? option.type : 'default'], option)
    var $footerSelector = _option.footer ? $(_option.footer) : $selector.next()
    var $swiper = $selector.closest('.swiper-wrapper')
    var _slick;

    var initInSwipe = function(){
        /*
            1.swipe를 생성할 때 안에 loop 옵션이 켜져 있으면 첫번째, 마지막 슬라이드가 자동복제된다.
            2.복제된 슬라이드가 slick일 경우 event는 복제하지 못하는 경우 발생

            해결 (완벽하지 않음)
            1.swipe를 먼저 생성 후 slick을 생성한다.
            2.slick의 index가 변할때 마다 duplicate 된 slick 또한 index를 맞춰준다.
        */
        _slick.on('afterChange', function(e, slick, currentIndex){
            var $slicks = _slick.slick('getSlick')
            $slicks.slickGoTo(currentIndex)
            _slick.slick('slickPause')
            _slick.slick('slickPlay')
        })
    }

    var setNewOption = function(option){
        if(option){
            _option = $.extend(_option, option)
        }
    }

    var onHandlePause = function(){
        var $stopBtn = $selector.parent().find(_option.stopBtn);
        var $playBtn = $selector.parent().find(_option.playBtn);
        $stopBtn.on('click', function(e){
            _slick.slick('slickPause')
            var onClickPause = _option['onClickPause']
            if(typeof onClickPause === 'function'){
                onClickPause(e, $stopBtn, $playBtn)
            }
        })
        $playBtn.on('click', function(e){
            _slick.slick('slickPlay')
            var onClickPlay = _option['onClickPlay']
            if(typeof onClickPlay === 'function'){
                onClickPlay(e, $stopBtn, $playBtn)
            }
        })
    }

    this.setSlick = function(){
        if( $selector.find(".slick-slide").length !== 1 ) {
            var addOnFunc = _self.slickAddOns[_option.type]
            if(_option.useFooter && typeof addOnFunc === 'function'){
                addOnFunc.bind(_self)($selector)
            }
            _slick = $selector.slick(_option); 
        }
    }

    this.slickAddOns = {
        centerauto : function($selector){
            var _self = this;
            $selector.on("init reInit",function(e,slick){
                try {
                    $footerSelector.find('strong').html(slick.$slides.length);
                } catch(m){
                    console.log(m);
                }
            });
        },
        countauto : function($selector){
            var _self = this;
            $selector.on("init reInit afterChange",function (event, slick, currentSlide, nextSlide){
                var i = (currentSlide ? currentSlide : 0) + 1;
                try {
                    $footerSelector.html('<em>' + i + '</em>' + '/' + '<strong>' + slick.$slides.length + '</strong>');
                } catch(m){
                    console.log(m);
                }
                
            });
        },
        countstop : function($selector){
            var _self = this;
            $selector.on("init reInit afterChange",function (event, slick, currentSlide, nextSlide){
                var i = (currentSlide ? currentSlide : 0) + 1;
                try {
                    $footerSelector.html('<em>' + i + '</em>' + '/' + '<strong>' + slick.$slides.length + '</strong>');
                } catch(m){
                    console.log(m);
                }
                
            });
        },
        totalcurrent : function($selector){
            var _self = this;
            $selector.on("init reInit afterChange",function (event, slick, currentSlide, nextSlide){
                var i = (currentSlide ? currentSlide : 0) + 1;
                try {
                    $footerSelector.html('<span>전체</span><em>' + i + '</em>' + '/' + '<strong>' + slick.$slides.length + '</strong>');
                } catch(m){
                    console.log(m);
                }
                
            });
        }
    }

    this.init = function(option){
        setNewOption(option)
        _self.setSlick()
        if($swiper.length){
            initInSwipe();
        }
        if(_option.autoplay){
            onHandlePause()
        }
    }

    this.init(_option)
    return _slick
}
/* UIComponent mobile.slick end */

/* UIComponent mobile - floatingmenu start */
$.fn.floatingmenu = function(option){
    var _self = this;
    var $selector = $(this);
    var _default = {
        'name' : 'floatingmenu',
        'upCallback' : function(){
            if(UI && typeof UI.timerAction !== 'undefined'){
                UI.timerAction.floatingGroup.resetTimeAction()
            }
        },
        'downCallback' : function($selector){
            // console.log("downCallback ::: ", $selector)
        }
    }
    var _option = $.extend({}, _default, option)

    function init(){
    }

    this.up = function(){
        $selector.show();
        if( !$selector.hasClass("up") ){
            $selector.addClass("up");
            $selector.removeClass("down");
        }
        var upCallback = _option['upCallback']
        if(typeof upCallback === 'function'){
            upCallback($selector)
        }
    }

    this.down = function(){
        $selector.show();
        if( !$selector.hasClass("down") ){
            $selector.removeClass("up");
            $selector.addClass("down");
        }
        var downCallback = _option['downCallback']
        if(typeof downCallback === 'function'){
            downCallback($selector)
        }
    }

    init();
    return this
}
/* UIComponent mobile - floatingmenu end */

/* UIComponent mobile - timerAction start */
$.fn.timerAction = function(option){
    var _self = this;
    var $selector = $(this);
    var _default = {
        'name' : 'timer',
        'timer' : 3000,
        'speed' : 0,
        'actionType' : 'hide', //hide
    }
    var actionTypes = {
        'hide' : 'show',
        'fadeOut' : 'fadeIn',
    }
    var _option = $.extend({}, _default, option)
    var _timer = null;

    var init = function(){
        _self.resetTimeAction()
    }

    this.getActions = function(){
        return {
            timerAction : _option.actionType,
            deaction : actionTypes[timerAction],
        }
    }

    this.resetTimeAction = function(){
        var timerAction = _option.actionType;
        var deaction = actionTypes[timerAction]

        if(timerAction && deaction){
            if(_timer != null){
                if(typeof $selector[deaction] === 'function'){
                    $selector[deaction](_option.speed)
                }
                clearTimeout(_timer);
            }
            
            _timer = setTimeout(function(){
                if(typeof $selector[timerAction] === 'function'){
                    $selector[timerAction](_option.speed)
                }
            }, _option.timer);
        }
    }

    init()

    return this
}
/* UIComponent mobile - timerAction end */

/* UIComponent mobile - navTabBar start */
$.fn.navTabBar = function(option){
    var _self = this;
    var $selector = $(this);
    var root = $('body');
    var _default = {
        'className' : 'fixed',
    }
    var _option = $.extend({}, _default, option)
    !_self.length ||root.addClass('floatingmenu-show');
    this.up = function(){
        if(!$selector.hasClass(_option.className)){
            $selector.addClass(_option.className);
            root.addClass('floatingmenu-show');
        }
    }
    this.down = function(){
        $selector.removeClass(_option.className);
        root.removeClass('floatingmenu-show');
    }
    return this
}
/* UIComponent mobile - navTabBar end */

/* UIComponent mobile - navScroller start */
$.fn.navScroller = function(option){
    var _self = this;
    var _default = {
        'index' : 0,
        'activeClass' : 'current',
        'autoToCenter' : true,
        // 'scrollerClass' : 'nav-scroller',
        'list' : 'ul li',
        'root' : 'body',
        'width' : 0,
        'name' : '',
        'onClick' : function(e, index){
            if(typeof AppMain !== 'undefined' && AppMain.swiper){
                AppMain.swiper.slideTo(index+1);
            }
        }
    }
    var _option = $.extend({}, _default, option)
    var _winHarf = $(_option.root).width()/2;

    var $selector = $(this)
    var $scroller = $selector.find('.sticky-inner');
    var $navList = $selector.find(_option.list);

    var _pos;
    var _wrapWidth = 0;
    // var _offset = $selector.offset() || {top:0, left:0}
    var _selectedIndex = _option.index

    var init = function(){
        if(!$navList.length) {
            console.log('navScroller. No exist element. "ul li"')
        }
        _self.resetWidth();
        onClickHandler();
        _self.select(_selectedIndex)
    }

    var onClickHandler = function(e){
        $selector.on('click', 'li > a', function(e){
            e.preventDefault()
            e.stopPropagation()
            var $li = $(e.target).closest('li');
            var index = $li.index()
            var onClickCallback = _option.onClick
            _self.select(index)

            if(typeof onClickCallback === 'function'){
                onClickCallback(e, index, $navList.length)
            }
        })
    }

    this.goCenter = function(){
        var $selected = $navList.eq(_selectedIndex)
        var _targetLeft = 0;
        var _selectedHalfWidth = $selected.outerWidth()/2
        for (var i=0; i < _selectedIndex; i++) {
            var $e = $navList.eq(i)
            var maginLeft = parseInt($e.css('margin-left').replace('px', ''))
            var maginRight = parseInt($e.css('margin-right').replace('px', ''))
            _targetLeft += ($navList.eq(i).outerWidth() + maginLeft + maginRight)
        }

        if((_targetLeft + _selectedHalfWidth) <= _winHarf) { // left
            _pos = 0;
        } else if ((_wrapWidth - _targetLeft - _selectedHalfWidth) <= _winHarf) { //right
            _pos = _wrapWidth-$('body').width();
        } else {
            _pos = _targetLeft - _winHarf + (_selectedHalfWidth) + parseInt($scroller.css('padding-left'));
        }
        setTimeout(function(){
            $scroller.animate({scrollLeft:_pos},300)
        }, 200);
    }

    this.resetWidth = function(){
        _wrapWidth = 0;
        $navList.each(function(i,e){
            var $navItem = $(e)
            var $navItemChild = $(e).find('> *')
            var $target = $navItem.outerWidth() < $navItemChild.outerWidth() ? $navItemChild : $navItem //li와 li의 자식중 넓이가 넓은 쪽으로 선택
            var maginLeft = parseInt($target.css('margin-left').replace('px', ''))
            var maginRight = parseInt($target.css('margin-right').replace('px', ''))
            _wrapWidth += (_option.width > 0 ? _option.width : ($target.outerWidth() + maginLeft + maginRight)) 
        })
        $selector.find('ul').css('width', _wrapWidth);
    }

    this.select = function(index){
        $navList.removeClass(_option.activeClass).eq(index).addClass(_option.activeClass)
        _selectedIndex = index
        _option.autoToCenter && _self.goCenter(_selectedIndex)
    }

    init()

    return this
}
/* UIComponent mobile - navScroller end */

/* UIComponent mobile - layerPopTrigger start */
$.fn.layerPopTrigger = function(option){
    var _default = {
        'ease' : 'swing',
        'speed' : 500,
        'open': false,
        'dataTarget' : null,
        'closer' : '.lyclose',
        'beforeOpen' : function(){
            if(typeof UI !== 'undefined' && UI.windowScroll){
                UI.windowScroll.disable()
            }
        },
        'beforeClose' : function(){
            if(typeof UI !== 'undefined' && UI.windowScroll){
                UI.windowScroll.enable()
            }
        },
        'afterOpen' : null,
        'afterClose' : null,
        'namespace' : '.layers'
    }
    var _option = $.extend({}, _default, option);

    return this.each(function(i, e){
        var $selector = $(e).closest("[data-target]").length === 0 ? $(e).closest("[data-target]") : $(e);
        var target =  $selector.attr("data-target");
        var $target = $('.'+target).eq(0) //하나만 선택
        var $popWrap = $target.children('div')
        var $formElements = $target.find('[tabindex], a, input, button')
        var $closer = $target.find(_option.closer);
        var video;
        var init = function(){
            if(!$selector.data('active')){
                $selector.data('active', true)
            }else{
                return;
            }
            if(_option.dataTarget !== null){
                target =  _option.dataTarget;
                $target = $('.'+_option.dataTarget).eq(0) //하나만 선택
                $closer = $target.find(_option.closer);

                

                modalOpen();
                onCloseHandler();
                return;
            }
            if(!$selector.length){
                console.log('No element. "' + _option['selector'] + '"')
            } else {
                $selector.data('active', true)
                onOpenHandler()
                onKeyHandler()
                onCloseHandler()
            }
        }
        
        var closeLayers = function(e){
            e.stopPropagation()
            var beforeClose = _option['beforeClose'];
            var afterClose = _option['afterClose'];
            var relatedTarget = {relatedTarget:$target};
            $target.trigger(e = $.Event('hiden'+_option.namespace, relatedTarget))
            if(typeof beforeClose === 'function'){
                if(beforeClose(e, target) === false){
                    //리턴값이 false면 실행하지 않음
                    return
                }
            }

            $target
                .fadeOut(200, function(){
                    $target.trigger(e = $.Event('hide'+_option.namespace, relatedTarget))
                    $target.css('z-index', '')
                })
                .find(".layer")
                .removeAttr("tabindex");

            if(typeof afterClose === 'function'){
                afterClose(e, target)
            }

            if($target.find('[data-modules-video]').length > 0){
                video = $target.find('[data-modules-video]');
                if(video.data('video') !== undefined && video.data('video')._videostatus){
                    video.video('initial')
                }
            }
        }
        

        var modalOpen = function(){

            var $el = $(this);
            var relatedTarget = {relatedTarget:$target, selector : $selector}
            var zIndex = 3000;
            if(target){
                var beforeOpen = _option['beforeOpen'];
                var afterOpen = _option['afterOpen'];
                $target.trigger(e = $.Event('show'+_option.namespace, relatedTarget))
                if($target.hasClass('popup-layerwrap')){
                    $target.css('z-index', (10 * ($('.popup-layerwrap:visible').length+1)) +zIndex )
                }
                if(typeof beforeOpen === 'function'){
                    if(beforeOpen(e, target) === false){
                        //리턴값이 false면 실행하지 않음
                        return
                    }
                }
                $target
                    .fadeTo(_option['speed'], 1, _option['ease'], function(){
                        $target.trigger(e = $.Event('shown'+_option.namespace, relatedTarget))
                    });
                    // 

                $popWrap
                    .attr("tabindex", "0")
                    .focus()

                if(typeof afterOpen === 'function'){
                    afterOpen(e, target)
                }

                var $focusTarget = $(e.target).closest('a, button, [tabindex]')
                $closer.data('data-focus-target', $focusTarget[0]);
                if($target.find('[data-modules-slick]').length !== 0){
                    $target.find('[data-modules-slick]').slick('setPosition');
                }
                
            }

            return false;
        }
        if(_option.open) {
            modalOpen();
            $selector.off('click');
        }
        var onOpenHandler = function(){
            $selector.off('click').on('click', function(e){
                modalOpen();
            })
        }

        

        var onKeyHandler = function(e){
            $target.off('keydown').on('keydown', function(e){
                if(e.key === 'Tab'){
                    var firstForm = $popWrap[0]
                    var lastForm = $formElements[$formElements.length-1]
                    
                    if(e.shiftKey){//백탭
                        if(firstForm === e.target){
                            e.preventDefault()
                            lastForm.focus()
                        }
                    } else {//탭
                        if(lastForm === e.target){
                            e.preventDefault()
                            firstForm.focus()
                        }
                    }
    
                }
            })
        }

        var onCloseHandler = function(){
            $closer.off('click').on('click', function(e){
                closeLayers(e);
                $(document).off(_option.namespace)
                // $closer.data().dataFocusTarget.focus()
                return false;
            });
            $('.'+target).on('click'+_option.namespace, function(e){
                if(e.target === $target[0] && !e.target.classList.contains('fulllayer')){
                    $closer.trigger('click');
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            })

        }
        init()
    })
}
/* UIComponent.mobile.layerPopTrigger end */

/* UIComponent common scrollManager start */
$.fn.scrollManager = function(option){
    var _self = this
    var $selector = $(this) 
    var _default = {
        name : undefined,
    }
    var _option = $.extend({}, _default, option)
    var _disabeld = false
    var name = _option['name'] ? '.'+_option['name'] : ''
    var customScroll = jQuery.Event('customScroll' + name);
    var customResize = jQuery.Event('customResize'+ name);
    var currentY = -1, moveY = -1, currentX = -1, moveX = -1, direction;
    var _timer = null

    this.enable = function(){
        _disabeld = false
        if($selector[0] === window){
            $('body').removeClass('hidden')
        } else {
            $selector.removeClass('hidden')
        }
        return $selector
    }

    this.disable = function(){
        _disabeld = true;
        if($selector[0] === window){
            $('body').addClass('hidden')
        } else {
            $selector.addClass('hidden')
        }
        return $selector
    }

    this.getDisabled = function(){
        return _disabeld
    }

    // $selector.on('touchstart',function(e){
    //     if(_disabeld) {
    //         return
    //     }
    //     currentY=e.originalEvent.changedTouches[0].screenY;
    //     currentX=e.originalEvent.changedTouches[0].screenX;
    // });

    // $selector.on('mousewheel',function(e){
    //     if(!_disabeld) {
    //         customScroll.originalEvent = e.originalEvent
    
    //         if(e.originalEvent.deltaY < 10){
    //             customScroll.delta = 1;
    //             customScroll.direction = "up";
    //         } else {
    //             customScroll.delta = -1;
    //             customScroll.direction = "down";
    //         }
    //     }
    // })

    // $selector.on('touchmove',function(e){
    //     if(!_disabeld) {
    //         customScroll.originalEvent = e.originalEvent
    //         moveY=e.originalEvent.changedTouches[0].screenY;

    //         if(currentY === -1) currentY = moveY
    
    //         if(currentY > moveY && direction === 'vertical'){
    //             customScroll.delta = 1;
    //             customScroll.direction = "down";
    //         } else if(currentY < moveY && direction === 'vertical'){
    //             customScroll.delta = -1;
    //             customScroll.direction = "up";
    //         }
    
    //         if(!direction){
    //             moveX=e.originalEvent.changedTouches[0].screenX;
    //             if(currentX === -1) currentX = moveX
    
    //             var absX = Math.abs(Math.abs(currentX) - Math.abs(moveX))
    //             var absY = Math.abs(Math.abs(currentY) - Math.abs(moveY))
                
    //             if(absX > 0 || absY > 1){
    //                 direction = absX >= absY ? 'horizontal' : 'vertical'
    //             }
    //         }
    //         currentY = moveY;
    //     }
    // });

    // $selector.on('touchend',function(e){
    //     direction = undefined
    // })

    $selector.on('scroll',function(e){
        //mousewheel에서는 정확한  scrollTop 수치가 나오지 않음
        //mousewheel에서는 방향만 얻어내고 scroll 이벤트에서 customScroll를 trigger
        var $this = $(this);

        
        // console.log(customScroll.scrollTop +', '+$this.scrollTop());
        // console.log(customScroll);
        if($this.scrollTop() >= 0 && customScroll.scrollTop > $this.scrollTop()){
            customScroll.delta = 1;
            
            customScroll.direction = "down";
            // console.log('down');
        } else if($this.scrollTop() > 0 && customScroll.scrollTop < $this.scrollTop()){
            customScroll.delta = -1;
            customScroll.direction = "up";
            // console.log('up');
        }



        if(!_disabeld) {
            customScroll.scrollTop = $selector.scrollTop()
            $(window).trigger(customScroll)
        }
        customScroll.scrollTop = $this.scrollTop();
    })

    $selector.on('resize',function(e){
        if(!_disabeld) {
            clearTimeout(_timer)
            _timer = setTimeout(function(){
                $(window).trigger(customResize)
            }, 200)
        }
    })

    return this

}
/* UIComponent common scrollManager end */

/* common UI - topButtonTrigger start */
$.fn.topButtonTrigger = function(option){
    var _self = this;
    var $selector = $(_self)
    var _default = {
        top : 40,
        speed : 500,
    }
    var _option = $.extend({}, _default, option)

    $selector.on('click', function(e){
        e.stopPropagation()
        _self.moveTop(_option['top'])
    })

    _self.moveTop = function(target){
        var top;
        if(typeof target === 'number'){
            top = target
        } else if(typeof target === 'string'){
            var $target = $(target);
            if($target.length){
                var rect = $target[0].getBoundingClientRect()
                top = rect.top
            }
        }
        console.log("_self.moveTop -> top", top)
        $('html,body').animate({ scrollTop: top}, _option['speed']);
    }

    return this
}
/* common UI - topButtonTrigger end */






/* UIComponent mobile - tabmenu start */
$.fn.tabmenu = function(option){
    var _default = {
        'index' : 0,
        'activeClass' : 'selected',
        'ready' : null,
        'before' : null,
        'after' : null,
        'tabContentClass' : 'tabcnt'
    }
    var _option = $.extend({}, _default, option)
    var _scroll = _option['scroll'] || false;
    var getNext = UI.ui.getNext;

    return this.each(function(i,e){
        var $selector = $(e);
        var $menu = $selector.find('> ul > li > a');
        var $contents = [];
        var _index = _option.index;
        var $tabToggle = $selector.find('> .ui-toggle')

        function init(){
            console.log("init -> init")
            setContents();
            delegateClick();
            // setIndex(_index);
            if(_scroll){
                $selector.find('> ul').addClass("scrtaboll");
            }
        };

        function getTotal(){
            return $selector.find('> ul > li > a').length //dynamic
        }
    
        function delegateClick(){
            $selector.off('click').on('click', '> ul > li > a', function(e){//dynamic
                e.stopPropagation();
                e.preventDefault();
                if($contents === null) return false;
                onClickButtonHandler(e, this);
                if($tabToggle.length !== 0){
                    $tabToggle.addClass('ui-active');
                }
                if($selector.parent().hasClass('fixed') && $selector.parent().data('sticky')){
                    $(window).scrollTop($selector.parent().data('sticky').options.pos)
                    // console.log($selector.parent().data('sticky').options.pos)
                }
                // 상품상세 텝 클릭시 스티키 적용
                if($selector.parent().hasClass('sticky_tab') && $selector.parent().data('sticky')){
                    $selector.parent().sticky('posRefresh');
                    $(window).scrollTop($selector.parent().data('sticky').options.pos)
                }
            });
            $tabToggle.off('click').on('click', function(e){
                var $this = $(this);
                if($this.hasClass('ui-active')){
                    $menu.closest('li').removeClass(_option.activeClass).attr('aria-selected' , false)
                    $contents.removeClass(_option.activeClass).attr('aria-selected' , false)
                    $this.removeClass('ui-active');
                    $selector.parent().removeClass('on');
                }else{
                    view(_index);
                    $this.addClass('ui-active');
                    $selector.parent().addClass('on');
                }
            })
        };

        function setContents(){
            var $childTab =  $selector.children('.tabcnt');
            var parentTab = getNext($selector[0], _option.tabContentClass);
            if($childTab.length){
                $contents = $childTab
            } else {
                if( parentTab !== null) $contents = $(parentTab.el).siblings();
            }
        };
    
        function view(index){
            setContents();
            $selector.attr('data-active-index', index)
            $menu.closest('li')
                .removeClass(_option.activeClass)
                .attr('aria-selected' , false)
                .eq(index)
                .addClass(_option.activeClass)
                .attr('aria-selected' , true);
            if($contents.length === 0) return;
                $contents
                .removeClass(_option.activeClass)
                .attr('aria-selected' , false)
                .eq(index)
                .addClass(_option.activeClass)
                .attr('aria-selected' , true);
            var changeEvent = $.Event('tabChange', {
                nav : $menu.closest('li').eq(index),
                content: $contents.eq(index)
            });
            $selector.trigger(changeEvent);
            if($selector.hasClass('sticky-tab') && $selector.closest('[data-modules-sticky]').length > 0){
                var stickyEl = $selector.closest('[data-modules-sticky]')
                var offsetTop = stickyEl.data('sticky').options.pos;
                // console.log(offsetTop);
                // console.log($('html, body').scrollTop());    
                if(stickyEl.hasClass('fixed')){
                    $('html, body').scrollTop(offsetTop);
                }
                $contents.eq(index).find('[data-modules-sticky]').removeClass('fixed')
            }
            
            setTimeout(function(){
                if($contents.eq(index).find('[data-modules-slick]').length !== 0){
                    $contents.eq(index).find('[data-modules-slick]').slick('setPosition')
                }
                if($contents.eq(index).find('[data-modules-cascadingGrid]').length !== 0){
                    $contents.eq(index).find('[data-modules-cascadingGrid]').cascadingGrid('mount')
                }
                if($contents.eq(index).find('[data-modules-sticky]').length !== 0){
                    
                    $contents.eq(index).find('[data-modules-sticky]').sticky('posRefresh');
                }
            }, 20)
            
        };
    
        /* handler */
        function onClickButtonHandler(e,target){
            var $target = $(target).closest('li');
            var index = $target.index()
            var beforeCallback = _option['before']
            var afterCallback = _option['after']

            if(typeof beforeCallback === 'function'){
                if(beforeCallback(e, $target, _index) === false){
                    //before에서 false를 리턴하면 탭동작을 막는다
                    return
                }
            }
            setIndex(index);
            if(typeof afterCallback === 'function'){
                afterCallback(e, $target, _index)
            }
        }
    
        var setIndex = function(index){
            if(index > getTotal() - 1){
                return;
            }
            _index = index;
            console.log(index);
            view(index);
        };
    
        init()
    })
}
/* UIComponent mobile - tabmenu end */

/* UIComponent common fontResizer start */
$.fn.fontResizer = function(option){
    var _self = this
    var _default = {
        name : undefined, //font-resize
        plus : '.btn-fontplus',
        minus : '.btn-fontminus',
        targets : ['pdname', 'pdprice', 'item-label', 'price-label'],
        step : 0,
        onSizeup : function(){
            if(typeof UI !== 'undefined' && UI.timerAction && UI.timerAction.floatingGroup){
                UI.timerAction.floatingGroup.resetTimeAction()
            }
        },
        onSizedown : function(){
            if(typeof UI !== 'undefined' && UI.timerAction && UI.timerAction.floatingGroup){
                UI.timerAction.floatingGroup.resetTimeAction()
            }
        },
    }
    var _option = $.extend({}, _default, option)
    var _totalSteps = [100, 125, 150] //percent
    var numReg = /(\-?[0-9]{0,}\.?[0-9]{0,})(.+)/
    var $targets = (function(targets){
        if(Array.isArray(targets)){
            return $(targets.map(function(cls){
                return '.'+ cls
            }).join(',')).find('*').addBack()
        } else if(typeof isArray === 'string'){
            return $('.'+targets)
        }
    })(_option.targets)

    return this.each(function(i, e){
        var $selector = $(e) 
        var $btnPlus = $selector.find(_option.plus)
        var $btnMinus = $selector.find(_option.minus)
        var _currentStep = _option.step;

        var init = function(){
            setFontSizeData()
            onClickHandler()
            setDisabled(_currentStep)
        }

        var setFontSizeData = function(){
            $targets.each(function(i,e){
                var computedStyle = getComputedStyle(e)
                var lineHeightInfos = computedStyle.lineHeight.match(numReg)
                var fontInfos = computedStyle.fontSize.match(numReg)
                
                $(e).data({
                    'line' : lineHeightInfos[1],
                    'lineUnit' : lineHeightInfos[2],
                    'size' : fontInfos[1],
                    'unit' : fontInfos[2],
                })
            })
        }
    
        var onClickHandler = function(){
            $btnPlus.off('click').on('click', function(e){
                if(_currentStep < _totalSteps.length-1){
                    UI.userScreenControl = true;
                    var onSizeup = _option.onSizeup
                    _currentStep += 1
                    setSize(_currentStep)
                    setDisabled()
                    if(typeof onSizeup === 'function'){
                        onSizeup(e)
                    }
                }
            })
            $btnMinus.off('click').on('click', function(e){
                if(_currentStep > 0){
                    UI.userScreenControl = true;
                    var onSizedown = _option.onSizedown
                    _currentStep -= 1
                    setSize(_currentStep)
                    setDisabled()
                    if(typeof onSizedown === 'function'){
                        onSizedown(e)
                    }
                }
            })
        }

        var setSize = function(index){
            $targets.each(function(i,e){  
                var data = $(e).data()  
                var line = data.line
                var lineUnit = data.lineUnit
                var size = data.size
                var unit = data.unit

                if(unit === 'px'){
                    var totalSize = size * _totalSteps[_currentStep] / 100;
                    e.style.fontSize = totalSize + unit
                }

                if(lineUnit === 'px'){
                    var totalSize = line * _totalSteps[_currentStep] / 100;
                    e.style.lineHeight = totalSize + lineUnit
                }
            });
            setTimeout(function(){
                UI.userScreenControl = false;
            }, 200)
            
            // console.log(userCtr);
        }

        var setDisabled = function(){
            $btnPlus.prop('disabled', false)
            $btnMinus.prop('disabled', false)
            if(_currentStep === 0){//0 1 2 - 3
                $btnMinus.prop('disabled', true)
            } else if(_currentStep === _totalSteps.length - 1){
                $btnPlus.prop('disabled', true)
            }
        }

        init()
    })
}
/* UIComponent common fontResizer end */

/* UIComponent common simpleAccordian start */
$.fn.simpleAccordian = function(option){
    var _default = {
        'itemSelector' : '.accitem',
        'type' : 'list',
        'trigger' : '.accordion-trigger',
        'selectedClass' : 'selected',
        'panel' : '.accordion-panel'
    }
    var _option = $.extend({}, _default, option)
    var $btns = $(this).find(_option.trigger)
    var types = {
        'list' : {//각각의 panel을 한번 더 감싼 div가 하나 더 있을 경우
            getAccordianItemsFromRoot : function($e){
                return $e.children(_option.itemSelector).children().not(_option.panel)
            },
            getCurrentPanelByClickedTarget : function($e){
                return $e.closest(_option.itemSelector)
            }
        },
        'plain' : {//trigger와 panel 들이 모두 같은 레벨에 있을때
            getAccordianItemsFromRoot : function($e){
                return $e.children().not(_option.panel)
            },
            getCurrentPanelByClickedTarget : function($e){
                return $e.parent().next(_option.panel)  
            }
        }
    }

    return this.each(function(i,e){
        var $selector = $(e)

        var init = function(){
            onClickHandler()
        }

        var onClickHandler = function(){
            var accordion = types[_option.type]

            if(accordion){
                accordion
                    .getAccordianItemsFromRoot($selector)
                    .off('click')
                    .on('click', _option.trigger, function(){
                        var $this = $(this)
                        var $item = accordion.getCurrentPanelByClickedTarget($this)
                        $btns.attr('aria-expanded', false)
                        
                        if($item.hasClass(_option.selectedClass)){
                            contract($item)
                        } else {
                            contract($item.siblings('.'+_option.selectedClass))
                            expend($item)
                            $this.attr('aria-expanded', true)
                        }
                    })
            }
        }

        var expend = function($item){
            $item.addClass(_option.selectedClass)
        }

        var contract = function($item){
            $item.removeClass(_option.selectedClass)
        }

        init()
    })
}
/* UIComponent common simpleAccordian end */

/* common UI - simpleSlider start*/
$.fn.simpleSlider = function(option){
    var _default = {
        'index' : 0,
        'items' : '> div > ul > li',
        'current' : '.numbering .current',
        'total' : '.numbering .total',
        'prev' : '.btn-prev',
        'next' : '.btn-next',
    }
    var _option = $.extend({}, _default, option)

    return this.each(function(i,e){
        var $selector = $(e);
        var $items = $selector.find(_option.items)
        var _length = $items.length
        var _index = _option.index || 0

        var init = function(){
            onClickHandler()
            showItemByIndex(_option.index)
            setPaging(_index)
        }

        var onClickHandler = function(){
            $selector.off('click').on('click', _option.prev, function(e){
                e.stopPropagation()
                var prevIndex = (_length+_index-1)%_length
                showItemByIndex(prevIndex)
            })
            $selector.off('click').on('click', _option.next, function(e){
                e.stopPropagation()
                var nextIndex = (_index+1)%_length
                showItemByIndex(nextIndex)
            })
        }

        var setPaging = function(index){
            $selector.find(_option.current).text(index+1)
            $selector.find(_option.total).text(_length)
        }
        
        var showItemByIndex  = function(index){
            _index = index
            $items.hide().eq(index).show()
            setPaging(index)
        }

        init()
    })    
}
/* common UI - simpleSlider end*/

/* common UI - simpleToast start*/
$.fn.simpleToast = function(option){
    var _self = this;
    var _default = {
        'text' : '텍스트를 입력하세요',
        'className' : 'common-toast-view',
        'type' : 'center',
        'time' :  2000,
    }
    var _option = $.extend({}, _default, option)
    var $selector = $(_self)
    var $toastWrap


    var init = function(){
        if(!$selector.find('.'+_option.className).length){
            $selector.append('<div class="'+_option.className+'"></div>')
        }
        $toastWrap = $selector.find('.'+_option.className).eq(0)
    }

    _self.createNewToast = function(text){
        var $text = $('<p class="toast-item"><span>'+text+'</span></p>')
        $toastWrap.append($text)

        $text.one('transitionend click', function(){
            $(this).remove()
        })

        setTimeout(function(){
            $text.css('opacity', 0)
        }, _option.time)

        // setTimeout(function(){
        //     $text.remove()
        // }, _option.time + 3000)
    }

    _self.removeAllToast = function(){
        $toastWrap.html('')
    }

    init()

    return _self
}
/* common UI - simpleToast end*/


/* UIComponent mobile end */

/* UIComponent end ********************************************************************/
window.addEventListener('message', function(e) {
    console.log('parent message');
    console.log(e.data); // { childData : 'test data' }
    console.log("e.origin : " + e.origin); //http://123.com(자식창 도메인)
  
});

//공통 구현부
$(function(){
    /* common iframe start */
    // 문서내에 iframe이 있을 경우 특수 처리.
    var $iframes = $('iframe');
    var checkHeader = $('.header');
    if(checkHeader.css('position') === "fixed"){
        $(document.body).addClass('header-fixed')
    }

    if($iframes.length){
        // 자꾸 에러나 !!!
        var addIframeFunc = function(iframe){
            try {
                var sub = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document
                $(sub.body).scrollManager({
                    'name' : 'iframe'
                })
            } catch (error) {

            }
        }
        
        $iframes.each(function(i,e){
            e.addEventListener('load', function(){
                addIframeFunc(e)
                // autoSetIframeHeight(e)
            })
        })

        $(window).on('customScroll.iframe', scrollAction)
    }
    /* common iframe end */

    /* mobile 공통 navScroller start */
    UI.navScroller = $('.navwrap').navScroller({
        'index' : 0,
        'autoToCenter' : true,
        'name' : 'global',
    })
    /* mobile 공통 navScroller end */

    /* 공통 scrollManager start */
    // UI.windowScroll = new UIComponent common scrollManager();
    // scrollManager : 스크롤을 
    UI.windowScroll = $(window).scrollManager({
        name : 'global'
    })
    $(window).on('customScroll.global', scrollAction)
    $(window).on('customResize.global', function(e){
        if($iframes.length){
            $iframes.each(function(i,e){
                autoSetIframeHeight(e)
            })
        }
    })
    /* //공통 scrollManager end */

    /* mobile 공통 floatingmenu start */
    UI.floatingMenu = $('.floating-menu').floatingmenu({
        timer : 5000,
    })
    /* //mobile 공통 floatingmenu end */

    /* mobile 공통 timerAction start */
    // timerAction : 일정기간이 지나면 특정 액션 실행.
    // resetTimeAction을 실행하면 시간을 리셋하고 반대되는 액션을 실행한다.
    UI.timerAction = {}
    UI.timerAction.floatingGroup = $('.floating-group').timerAction({
        'action' : 'hide',
        'speed' :  200,
        'timer' : 2000
    })
    /* mobile 공통 timerAction start */


    /* 공통 topButtonTrigger 구현 start */
    UI.topButtonTrigger = $('.btn-topmove').topButtonTrigger({
        'top': 0,
        'speed' : 100
    })
    /* 공통 topButtonTrigger 구현 end */


    /* 공통 tabmenu 구현 start */
    UI.tabmenu = $('.tab').tabmenu();
    /* 공통 tabmenu 구현 end */
    

    /* mobile 공통 navTabBar start */
    UI.navTabBar = $('.nav-tabbar').navTabBar()
    UI.navTabBar.on('click', 'li a', function(e){
        var $a = $(e.target).closest('a');
        var $li = $a.closest('li')

        // 개발 삭제 요청
        // if($li.hasClass('menu-cate')){ //전체 카테고리 메뉴 열기
        //     $(".sidebar-area").addClass("active");
        //     UI.windowScroll.disable()
        // }

        if($li.hasClass('menu-onair')){ //On Air 리스트 열고 닫기
            $a.toggleClass("close");
            var insertTxt = null;
            var closed = $a.hasClass("close");

            if(closed){
                insertTxt = "On Air 닫기";
                UI.windowScroll.disable()
                $a.next(".onairwrap").addClass("active");
                if($a.next(".onairwrap").find('.ui-dim').length === 0) $a.next(".onairwrap").append('<span class="ui-dim"></span>')
            } else{
                insertTxt = "On Air";
                UI.windowScroll.enable();
                $a.next(".onairwrap").removeClass("active");
            }
            $a.children("span").text(insertTxt);
            
        }
    })
    /* //mobile 공통 navTabBar end */

    /* mobile 공통 layerPopTrigger start */
    UI.layerPopTrigger = $('.lyopen').layerPopTrigger({
        'closer' : '.lyclose',
    })
    /* //mobile 공통 layerPopTrigger end */

    /* mobile 공통 fontResizer start */
    $('.font-resize').fontResizer({
        plus : '.btn-fontplus',
        minus : '.btn-fontminus',
    })
    /* //mobile 공통 fontResizer end */


    /* mobile 공통 simpleAccordian start */
    $('.accordion').simpleAccordian({
        'type' : 'plain'
    })
    $('.accstyle').simpleAccordian({
        'type' : 'list'
    })
    /* //mobile 공통 simpleAccordian end */

    /* mobile 공통 simpleAccordian start */
    UI.Toast = $('body').simpleToast()
    // UI.Toast.createNewToast('이렇게 띄웁니다.') //여러개 띄우기 가능

    /* mobile 공통 simpleAccordian start */

    /* 임시 처리 */
    $(".ukslideshow").on("touchstart mousedown", function(e){
        e.stopPropagation()
    })

    // [10/23]_수정(개발요청으로 주석처리)
    // $(".sidebar-area .btn-close").click(function(){ //전체 카테고리 메뉴 닫기
    //     $(".sidebar-area").removeClass("active");
    //     UI.windowScroll.enable()
    // });
    // [10/23]

    $(".popup-layerwrap .btn-close").click(function(){ //열려 있는 팝업 닫기 (버튼이나 링크 클릭시 닫힘)
        $(".popup-layerwrap").removeClass("active");
    });
    
    /* 개발요청으로 주석처리 08/13
    $(".btn-like").on("click",function(){ // 찜하기
        var insertTxt = null;
        $(this).toggleClass("active");
        if($(this).hasClass("active")){
            insertTxt = "찜하기 완료";
        }else{
            insertTxt = "찜하기";
        }
        $(this).children("span").text(insertTxt);
    }); 
    */

    $(document).on("click", '.btn-arrange', function(e){ // 리스트 정렬
        var $this = $(this);
        var doc = $(document);
        var itemList = doc.find('.itemlist.variable-list');
        var productList = doc.find('.product-list.variable-list');
        
        // var searchResult = doc.find(".search-resultwrap");
        
        if($this.hasClass("col1")){
            $this.parents(".arrange").addClass("arr2").removeClass("arr1");
            itemList.find('.pdwrap').removeClass("pdgrid").addClass("pdlist");
            productList.find('.pdwrap').removeClass("pdgrid").addClass("pdlist");
            // searchResult.find('.pdwrap').removeClass("pdgrid").addClass("pdlist");
        }else if($this.hasClass("col2")){
            $this.parents(".arrange").addClass("arr1").removeClass("arr2");
            itemList.find('.pdwrap').removeClass("pdlist").addClass("pdgrid");
            productList.find('.pdwrap').removeClass("pdlist").addClass("pdgrid");
            // searchResult.find('.pdwrap').removeClass("pdlist").addClass("pdgrid");
        }
        setTimeout(function(){
            if (itemList.find('[data-modules-slick]').length !== -1){
                itemList.find('[data-modules-slick]').slick('setPosition')
            }
            if (productList.find('[data-modules-slick]').length !== -1){
                productList.find('[data-modules-slick]').slick('setPosition')
            }
            // if (searchResult.find('[data-modules-slick]').length !== -1){
            //     productList.find('[data-modules-slick]').slick('setPosition')
            // }
        }, 0)
    })
    .on('click', '[data-target]', function(e){
        var $this = $(this);
        
        if(!$this.data('active')){
            $this.layerPopTrigger({
                closer : '.lyclose',
                open : true
            })
        }
        // .layerPopTrigger({
        //     'closer' : '.lyclose',
        // })
    })
    .on('click', '.nav-tabbar .ui-dim', function(e){
        $('.nav-tabbar').find('a.close').trigger('click');
    })
    // $(".footer-company").on("click",function(){
    //     $(this).toggleClass("active");
    //     $(this).next(".footer-info").toggleClass("active");
    // });

    /* 개발요청으로 임시 주석 처리 8/5
    $(".menu-recent").click(function(){ //최근 본 쇼핑 열기
        $(".recentwrap").addClass("active");
        UI.windowScroll.disable()
    });

    $(".recentwrap .btn-close").click(function(){ //최근 본 쇼핑 닫기
        $(".recentwrap").removeClass("active");
        UI.windowScroll.enable()
    }); */


    /* $('.touch-x').each(function(i, e){ 
        $(e).touchFlow({ 
            axis: "x", 
            snap: true, 
            scrollbar: false, 
            scrollbarAutoHide: true, 
        }); 
    }) 
    $('.touch-y').each(function(i, e){ 
        $(e).touchFlow({ 
            axis: "y", 
            snap: true, 
            scrollbar: false, 
            scrollbarAutoHide: true, 
        }); 
    })   */
    /*
    var ukScroll;
    $(window).scroll(function(event){
        ukScroll = true;
    });
    setInterval(function() {
        if (!ukScroll) {
            navBarFixed();
            ukScroll = false;
        }
    }, 150);
    */
//    uxTab();
   categroupTab();
//    uxtabGp();
//    accordionAction();
//    accstyleAction();
   keyboardAction();

   $(document).on('click', '.ui-showtab', function(e){
        e.preventDefault();
        var $this = $(this);
        var tab = $this.siblings('.tabgroup.relationgp').find('.tab');
        
        $this.siblings('.tabgroup.relationgp').show();
        tab.find('> ul > li:eq(0) > a').trigger('click');
        var tabCnt = $this.siblings('.tabgroup.relationgp').find('.tabcnt.selected');
        if(tabCnt.find('.slick-current [data-modules-video]').length > 0 && tabCnt.find('.slick-current [data-modules-video]').data('video') !== undefined && tabCnt.find('.slick-current [data-modules-video]').data('video')._autoplay == true && tabCnt.find('.slick-current [data-modules-video]').data('video')._videostatus === null){
            tabCnt.find('.slick-current [data-modules-video] ._play').trigger('click');
        }
    })
    .on('click', '.tab .btn.ui-toggle', function(){
        var $this = $(this);
        var target = $this.closest('.tabgroup')
        setTimeout(function(){
            target.hide();
            if(target.find('.slick-current [data-modules-video]').length > 0 && target.find('.slick-current [data-modules-video]').data('video') !== undefined && target.find('.slick-current [data-modules-video]').data('video')._videostatus !== null ){
                target.find('.slick-current [data-modules-video]').video('initial')
            }
        }, 100)
    })
});

/* Bottom Tab Bar Navigation 
function navBarFixed() { 
    var lastScrollTop = 0;
    var modeType;
    $(document).width() > $(document).height() ? modeType = "portrait" : modeType = "landscape";
    $(window).scroll(function(e){
        var scTop = $(this).scrollTop();
        var scMode = $(document).width() > $(document).height();
        scMode ? sModeType = "portrait" : sModeType = "landscape";
        if(sModeType!=modeType) { // Mode Check
            modeType = sModeType;
            return false;
        }
        if(scTop - lastScrollTop > 150) return false;
        scTop < lastScrollTop ? $('.nav-tabbar').addClass('fixed') : $('.nav-tabbar').removeClass('fixed');
        lastScrollTop = scTop;
    });
};
*/
/* tab 안쓰는것 같음. */
function uxTab(){
    uxTab = $('.tab');
    uxTab.each(function(i, e){
        var uxTabMenu = $(e).find('.tabmenu > li');
        uxTabMenu.on('click focusin', function(){
            var idx = $(this).index();
            uxTabMenu.eq(idx).addClass('selected').siblings().removeClass('selected');
            uxTabMenu.eq(idx).children().attr('aria-selected','true').parent().siblings().children().attr('aria-selected','false');
            return false
        });
    });
}
/* Category tab */
function categroupTab(){
    cateGroup = $('.categroup');
    cateGroup.each(function(i, e){
        var cateMenu = $(e).find('ul > li');
        cateMenu.on('click focusin', function(){
            var idx = $(this).index();
            cateMenu.eq(idx).addClass('current').siblings().removeClass('current');
        });
    });
}
/* uxtabgroup */
function uxtabGp(){
    uxTabGroup = $('.uxtabgp');
    uxTabGroup.each(function(i, e){
        var uxTabMenu = $(e).find('.tabmenu > li');
        var uxtabCnt = $(e).find('> .tabcnt');
        uxTabMenu.on('click focusin', function(){
            var idx = $(this).index();
            uxTabMenu.eq(idx).addClass('selected').siblings().removeClass('selected');
            uxTabMenu.eq(idx).children().attr('aria-selected','true').parent().siblings().children().attr('aria-selected','false');
            uxtabCnt.eq(idx).addClass('selected').siblings().removeClass('selected');
            uxtabCnt.eq(idx).attr('aria-selected','true').siblings().attr('aria-selected','false');
            return false
        });
    });
}
/* Accordian Style Type */
function accordionAction(){
    $('.accordion').each(function (i, e) {
        var accordionTrigger = $(e).find('h3>.accordion-trigger');
        var accordionPanel = $(e).find('.accordion-panel');
        accordionTrigger.on('click touchstart', function () {
            $(this).parent().addClass('selected').siblings().removeClass('selected');
            $(this).attr('aria-expanded','true').parent().siblings().children().attr('aria-expanded','false');
            $(this).parent().next().addClass('selected').parent().siblings().removeClass('selected');
            return false;
        });
    });
}
/* Accordian Style Type1 */
function accstyleAction(){
    $('.accstyle').each(function (i, e) {
        var accItem = $(e).find('.accitem');
        var accTrigger = $(e).find('h3>.accordion-trigger');
        var accPanel = $(e).find('.accordion-panel');
        accTrigger.on('click touchstart', function () {
            $(this).parent().parent().addClass('selected').siblings().removeClass('selected');
            return false;
        });
    });
}
/* Portrait & Landscape Check */
function modeOrientation(){
    $(window).on("orientationchange", function(event){
        if(window.matchMedia("(orientation: portrait)").matches){
            // 세로 모드 (평소 사용하는 각도)
        }else if(window.matchMedia("(orientation: landscape)").matches){
            // 가로 모드 (동영상 볼때 사용하는 각도)
        }
    });
};
/* keyboard open/close */
function keyboardAction(){
    $(".btn-keyborad").each(function(i, e){
        var keyBoard = $(e);
        keyBoard.on("click", function(){
            $(".pckeyboard").toggle();
        })
    })
}

/* common util start */
var autoSetIframeHeight = function(iframe){
    try {
        var sub = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document
        iframe.style.height = sub.body.scrollHeight+'px'
    } catch (error) {

    }
}

var scrollAction = function(e){
    var root = $(document.body);
    var $navScroller = UI.navScroller;
    var scrollTop = e.scrollTop;
    var direction = e.direction;
    var checkTopHide = 300;
    var fixedHeaders = $('[data-header-fixed]');
    if(fixedHeaders.length !== 0){
        var fixedHeadersValue = ($('.'+fixedHeaders.data('headerFixed')).eq(0).offset().top - fixedHeaders.height()) < 0 ? 0 : $('.'+fixedHeaders.data('headerFixed')).eq(0).offset().top - fixedHeaders.height();
        if(fixedHeaders.length != 0){
            if(scrollTop > fixedHeadersValue){
                fixedHeaders.removeClass('type-blank');
            }else{
                fixedHeaders.addClass('type-blank');
            }
        }
    }
    


    scrollTop > UI.navScroller.offset.top ? $navScroller.addClass("fixed") : $navScroller.removeClass("fixed");

    if(checkTopHide <= scrollTop ){
        $('.btn-topmove').addClass('ui-active')
    }else{
        $('.btn-topmove').removeClass('ui-active')
    }
    //floating 메뉴와 하단네비게이션바 컨트롤 start\
    if(direction === 'up' && !UI.userScreenControl){
        !UI.floatingMenu.length || UI.floatingMenu.down();
        !UI.navTabBar.length || UI.navTabBar.down();
    } else if(direction === 'down' && !UI.userScreenControl){
        !UI.floatingMenu.length || UI.floatingMenu.up();
        !UI.navTabBar.length || UI.navTabBar.up();
    }
    //floating 메뉴와 하단네비게이션바 컨트롤 end



    //scrollTop 높이에 따라 메뉴 class 변경 start
    // if(scrollTop > 50){
        
    // }
    // if(scrollTop <= 0){

    // }
}
/* common util end */

/*
개발 확인용 임시 스크립트 추가 (시작)
*/
// $().ready(function(){
//     $("a.btn-like").on("click", function(){
//         $(this).toggleClass("active");
//     });
//     $("a.btn-alim").on("click", function(){
//         $(this).toggleClass("on");
//         if($(this).children(".badge").length < 1) $(this).find(".icon").after('<em class="badge sm">0</em>');
//         if($(this).hasClass("on")) $(this).find(".badge").text(parseInt($(this).find(".badge").text())+1);
//     });
// });
/*
개발 확인용 임시 스크립트 추가 (끝)
*/


// var _tabbar_ScrollTop = 0;
// var _didScroll;
// var _delta = 5;  
// var tabbarHeight = 100;

// $(window).on("scroll", function(event){
//     _didScroll = true;
    
//     // console.log(event);
//     if($(".nav-tabbar").is(".fixed") === true && $(this).scrollTop() == 0){
//         $(".nav-tabbar").removeClass("fixed");
//     }

//     if (_didScroll){
//         tabbar_hasScrolled($(this).scrollTop());
//         _didScroll = false;
//     }
// });

// function tabbar_hasScrolled(st) {
    
//     if(Math.abs(_tabbar_ScrollTop - st) <= _delta) return;
//     // console.log(tabbarHeight);
    
//     if (st > _tabbar_ScrollTop){
//         $('.ui-nav.ui-active strong').text("111")    
//         $('.nav-tabbar').addClass('fixed');
//     } else {
//         $('.ui-nav.ui-active strong').text("222")    
//         $('.nav-tabbar').removeClass('fixed');
//     }
//     _tabbar_ScrollTop = st;
// }
