"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = global || self, global.bundle = factory());
})(void 0, function () {
  'use strict';

  var objPrototype = Object.prototype;
  var hasOwnProperty = objPrototype.hasOwnProperty;

  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }

  var strPrototype = String.prototype;

  var startsWithFn = strPrototype.startsWith || function (search) {
    return this.lastIndexOf(search, 0) === 0;
  };

  function startsWith(str, search) {
    return startsWithFn.call(str, search);
  }

  var arrPrototype = Array.prototype;

  var includesFn = function includesFn(search, i) {
    return !!~this.indexOf(search, i);
  };

  var includesStr = strPrototype.includes || includesFn;
  var includesArray = arrPrototype.includes || includesFn;

  function includes(obj, search) {
    return obj && (isString(obj) ? includesStr : includesArray).call(obj, search);
  }

  function noop() {}

  function isBoolean(value) {
    return typeof value === 'boolean';
  }

  function isString(value) {
    return typeof value === 'string';
  }

  function isUndefined(value) {
    return value === void 0;
  }

  function isFunction(obj) {
    return typeof obj === 'function';
  }

  function isObject(obj) {
    return obj !== null && _typeof(obj) === 'object';
  }

  function last(array) {
    return array[array.length - 1];
  }

  var toString = objPrototype.toString;

  function isDocument(obj) {
    return isObject(obj) && obj.nodeType === 9;
  }

  function isJQuery(obj) {
    return isObject(obj) && !!obj.jquery;
  }

  function isNode(obj) {
    return isObject(obj) && obj.nodeType >= 1;
  }

  function isElement(obj) {
    return isObject(obj) && obj.nodeType === 1;
  }

  function isNodeCollection(obj) {
    return toString.call(obj).match(/^\[object (NodeList|HTMLCollection)\]$/);
  }

  var isArray = Array.isArray;

  function toNode(element) {
    return isNode(element) ? element : isNodeCollection(element) || isJQuery(element) ? element[0] : isArray(element) ? toNode(element[0]) : null;
  }

  function toNodes(element) {
    return isNode(element) ? [element] : isNodeCollection(element) ? arrPrototype.slice.call(element) : isArray(element) ? element.map(toNode).filter(Boolean) : isJQuery(element) ? element.toArray() : [];
  }

  function attr(element, name, value) {
    if (isObject(name)) {
      for (var key in name) {
        attr(element, key, name[key]);
      }

      return;
    }

    if (isUndefined(value)) {
      element = toNode(element);
      return element && element.getAttribute(name);
    } else {
      toNodes(element).forEach(function (element) {
        if (isFunction(value)) {
          value = value.call(element, attr(element, name));
        }

        if (value === null) {
          removeAttr(element, name);
        } else {
          element.setAttribute(name, value);
        }
      });
    }
  }

  function hasAttr(element, name) {
    return toNodes(element).some(function (element) {
      return element.hasAttribute(name);
    });
  }

  function removeAttr(element, name) {
    element = toNodes(element);
    name.split(' ').forEach(function (name) {
      return element.forEach(function (element) {
        return element.hasAttribute(name) && element.removeAttribute(name);
      });
    });
  }

  function addClass(element) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    apply(element, args, 'add');
  }

  function removeClass(element) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    apply(element, args, 'remove');
  }

  function replaceClass(element) {
    (arguments.length <= 1 ? undefined : arguments[1]) && removeClass(element, arguments.length <= 1 ? undefined : arguments[1]);
    (arguments.length <= 2 ? undefined : arguments[2]) && addClass(element, arguments.length <= 2 ? undefined : arguments[2]);
  }

  function hasClass(element, cls) {
    return cls && toNodes(element).some(function (element) {
      return element.classList.contains(cls.split(' ')[0]);
    });
  }

  function toggleClass(element) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    console.log(args);

    if (!args.length) {
      return;
    }

    args = getArgs(args);
    var force = !isString(last(args)) ? args.pop() : []; // in iOS 9.3 force === undefined evaluates to false

    args = args.filter(Boolean);
    toNodes(element).forEach(function (_ref) {
      var classList = _ref.classList;

      for (var i = 0; i < args.length; i++) {
        supports.Force ? classList.toggle.apply(classList, _toConsumableArray([args[i]].concat(force))) : classList[(!isUndefined(force) ? force : !classList.contains(args[i])) ? 'add' : 'remove'](args[i]);
      }
    });
  }

  function test() {
    var aa = {
      bb: 1,
      cc: 2
    };
    console.log(hasOwn(aa, 'dd')); // console.log(getArgs(['aab', 'ddddd dsf dsf22', 'ddddd dfffd', 'ddddddfffd']))
  }

  function apply(element, args, fn) {
    var args = getArgs(args).filter(Boolean); // Array.prototype.filter(), 배열을 검색해서 boolean으로 평가 후 false로 평가되는 값을 제거한다.

    args.length && toNodes(element).forEach(function (_ref2) {
      var classList = _ref2.classList;
      args.forEach(function (cls) {
        return classList[fn](cls);
      });
    });
  }

  function getArgs(args) {
    return args.reduce(function (args, arg) {
      return (
        /**
         * concat을 콜하여 문자열이고 문자열 사이에 공백이 있는지 체크하여 공백이 있으면 공백을 기준으로 배열로 나눠서 합치고.
         * 공백이 없다면 그냥 합쳐서 반환한다.
         * 또한 concat에 잘못된 값이 전달되어 에러가 발생할 경우 (args.concat.call(args)로 하면 뒤의 값을 반환한다.) 빈 배열을 반환한다.
         */
        args.concat.call(args, isString(arg) && includes(arg, ' ') ? arg.trim().split(' ') : arg)
      );
    }, []);
  } // IE 11


  var supports = {
    get Multiple1111() {
      return this;
    },

    get Force() {
      return this.get('_force');
    },

    get: function get(key) {
      if (!hasOwn(this, key)) {
        var _document$createEleme = document.createElement('_'),
            classList = _document$createEleme.classList;

        classList.add('a', 'b');
        classList.toggle('c', false);
        this._multiple = classList.contains('b');
        this._force = !classList.contains('c');
      }

      return this[key];
    }
  };
  var inBrowser = typeof window !== 'undefined';
  var isIE = inBrowser && /msie|trident/i.test(window.navigator.userAgent);
  var isRtl = inBrowser && attr(document.documentElement, 'dir') === 'rtl';
  var hasTouchEvents = inBrowser && 'ontouchstart' in window;
  var hasPointerEvents = inBrowser && window.PointerEvent;
  var hasTouch = inBrowser && (hasTouchEvents || window.DocumentTouch && document instanceof DocumentTouch || navigator.maxTouchPoints); // IE >=11

  var pointerDown = hasPointerEvents ? 'pointerdown' : hasTouchEvents ? 'touchstart' : 'mousedown';
  var pointerMove = hasPointerEvents ? 'pointermove' : hasTouchEvents ? 'touchmove' : 'mousemove';
  var pointerUp = hasPointerEvents ? 'pointerup' : hasTouchEvents ? 'touchend' : 'mouseup';
  var pointerEnter = hasPointerEvents ? 'pointerenter' : hasTouchEvents ? '' : 'mouseenter';
  var pointerLeave = hasPointerEvents ? 'pointerleave' : hasTouchEvents ? '' : 'mouseleave';
  var pointerCancel = hasPointerEvents ? 'pointercancel' : 'touchcancel'; // 셀럭터를 찾아주는 함수?

  function query(selector, context) {
    return toNode(selector) || find(selector, getContext(selector, context));
  } // 셀럭터 전부를 찾아주는 함수?


  function queryAll(selector, context) {
    var nodes = toNodes(selector);
    return nodes.length && nodes || findAll(selector, getContext(selector, context));
  }

  function getContext(selector) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return isContextSelector(selector) || isDocument(context) ? context : context.ownerDocument;
  }

  function find(selector, context) {
    return toNode(_query(selector, context, 'querySelector'));
  }

  function findAll(selector, context) {
    return toNodes(_query(selector, context, 'querySelectorAll'));
  }

  function _query(selector) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    var queryFn = arguments.length > 2 ? arguments[2] : undefined;

    if (!selector || !isString(selector)) {
      return null;
    }

    selector = selector.replace(contextSanitizeRe, '$1 *');
    var removes;

    if (isContextSelector(selector)) {
      removes = [];
      selector = splitSelector(selector).map(function (selector, i) {
        var ctx = context;

        if (selector[0] === '!') {
          var selectors = selector.substr(1).trim().split(' ');
          ctx = closest(parent(context), selectors[0]);
          selector = selectors.slice(1).join(' ').trim();
        }

        if (selector[0] === '-') {
          var _selectors = selector.substr(1).trim().split(' ');

          var prev = (ctx || context).previousElementSibling;
          ctx = matches(prev, selector.substr(1)) ? prev : null;
          selector = _selectors.slice(1).join(' ');
        }

        if (!ctx) {
          return null;
        }

        if (!ctx.id) {
          ctx.id = "uk-".concat(Date.now()).concat(i);
          removes.push(function () {
            return removeAttr(ctx, 'id');
          });
        }

        return "#".concat(escape(ctx.id), " ").concat(selector);
      }).filter(Boolean).join(',');
      context = document;
    }

    try {
      return context[queryFn](selector);
    } catch (e) {
      return null;
    } finally {
      removes && removes.forEach(function (remove) {
        return remove();
      });
    }
  }

  var contextSelectorRe = /(^|[^\\],)\s*[!>+~-]/;
  var contextSanitizeRe = /([!>+~-])(?=\s+[!>+~-]|\s*$)/g;

  function isContextSelector(selector) {
    return isString(selector) && selector.match(contextSelectorRe);
  }

  var selectorRe = /.*?[^\\](?:,|$)/g;

  function splitSelector(selector) {
    return selector.match(selectorRe).map(function (selector) {
      return selector.replace(/,$/, '').trim();
    });
  }

  var elProto = inBrowser ? Element.prototype : {};
  var matchesFn = elProto.matches || elProto.webkitMatchesSelector || elProto.msMatchesSelector || noop;

  function matches(element, selector) {
    return toNodes(element).some(function (element) {
      return matchesFn.call(element, selector);
    });
  }

  var closestFn = elProto.closest || function (selector) {
    var ancestor = this;

    do {
      if (matches(ancestor, selector)) {
        return ancestor;
      }
    } while (ancestor = parent(ancestor));
  };

  function closest(element, selector) {
    if (startsWith(selector, '>')) {
      selector = selector.slice(1);
    }

    return isElement(element) ? closestFn.call(element, selector) : toNodes(element).map(function (element) {
      return closest(element, selector);
    }).filter(Boolean);
  }

  function parent(element) {
    element = toNode(element);
    return element && isElement(element.parentNode) && element.parentNode;
  }

  var escapeFn = inBrowser && window.CSS && CSS.escape || function (css) {
    return css.replace(/([^\x7f-\uFFFF\w-])/g, function (match) {
      return "\\".concat(match);
    });
  };

  function escape(css) {
    return isString(css) ? escapeFn.call(null, css) : '';
  }
  /* global setImmediate */


  var Promise = inBrowser && window.Promise || PromiseFn;

  var Deferred = function Deferred() {
    var _this = this;

    _classCallCheck(this, Deferred);

    this.promise = new Promise(function (resolve, reject) {
      _this.reject = reject;
      _this.resolve = resolve;
    });
  };
  /**
   * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
   */
  //  var Promise = window.Promise || PromiseFn;


  var RESOLVED = 0;
  var REJECTED = 1;
  var PENDING = 2;
  var async = inBrowser && window.setImmediate || setTimeout;

  function PromiseFn(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.deferred = [];
    var promise = this;

    try {
      executor(function (x) {
        promise.resolve(x);
      }, function (r) {
        promise.reject(r);
      });
    } catch (e) {
      promise.reject(e);
    }
  }

  PromiseFn.reject = function (r) {
    return new PromiseFn(function (resolve, reject) {
      reject(r);
    });
  };

  PromiseFn.resolve = function (x) {
    return new PromiseFn(function (resolve, reject) {
      resolve(x);
    });
  };

  PromiseFn.all = function all(iterable) {
    return new PromiseFn(function (resolve, reject) {
      var result = [];
      var count = 0;

      if (iterable.length === 0) {
        resolve(result);
      }

      function resolver(i) {
        return function (x) {
          result[i] = x;
          count += 1;

          if (count === iterable.length) {
            resolve(result);
          }
        };
      }

      for (var i = 0; i < iterable.length; i += 1) {
        PromiseFn.resolve(iterable[i]).then(resolver(i), reject);
      }
    });
  };

  PromiseFn.race = function race(iterable) {
    return new PromiseFn(function (resolve, reject) {
      for (var i = 0; i < iterable.length; i += 1) {
        PromiseFn.resolve(iterable[i]).then(resolve, reject);
      }
    });
  };

  var p = PromiseFn.prototype;

  p.resolve = function resolve(x) {
    var promise = this;

    if (promise.state === PENDING) {
      if (x === promise) {
        throw new TypeError('Promise settled with itself.');
      }

      var called = false;

      try {
        var then = x && x.then;

        if (x !== null && isObject(x) && isFunction(then)) {
          then.call(x, function (x) {
            if (!called) {
              promise.resolve(x);
            }

            called = true;
          }, function (r) {
            if (!called) {
              promise.reject(r);
            }

            called = true;
          });
          return;
        }
      } catch (e) {
        if (!called) {
          promise.reject(e);
        }

        return;
      }

      promise.state = RESOLVED;
      promise.value = x;
      promise.notify();
    }
  };

  p.reject = function reject(reason) {
    var promise = this;

    if (promise.state === PENDING) {
      if (reason === promise) {
        throw new TypeError('Promise settled with itself.');
      }

      promise.state = REJECTED;
      promise.value = reason;
      promise.notify();
    }
  };

  p.notify = function notify() {
    var _this2 = this;

    async(function () {
      if (_this2.state !== PENDING) {
        while (_this2.deferred.length) {
          var _this2$deferred$shift = _this2.deferred.shift(),
              _this2$deferred$shift2 = _slicedToArray(_this2$deferred$shift, 4),
              onResolved = _this2$deferred$shift2[0],
              onRejected = _this2$deferred$shift2[1],
              resolve = _this2$deferred$shift2[2],
              reject = _this2$deferred$shift2[3];

          try {
            if (_this2.state === RESOLVED) {
              if (isFunction(onResolved)) {
                resolve(onResolved.call(undefined, _this2.value));
              } else {
                resolve(_this2.value);
              }
            } else if (_this2.state === REJECTED) {
              if (isFunction(onRejected)) {
                resolve(onRejected.call(undefined, _this2.value));
              } else {
                reject(_this2.value);
              }
            }
          } catch (e) {
            reject(e);
          }
        }
      }
    });
  };

  p.then = function then(onResolved, onRejected) {
    var _this3 = this;

    return new PromiseFn(function (resolve, reject) {
      _this3.deferred.push([onResolved, onRejected, resolve, reject]);

      _this3.notify();
    });
  };

  p.catch = function (onRejected) {
    return this.then(undefined, onRejected);
  };

  var voidElements = {
    area: true,
    base: true,
    br: true,
    col: true,
    embed: true,
    hr: true,
    img: true,
    input: true,
    keygen: true,
    link: true,
    menuitem: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true
  };

  function isVoidElement(element) {
    return toNodes(element).some(function (element) {
      return voidElements[element.tagName.toLowerCase()];
    });
  }

  function isVisible(element) {
    return toNodes(element).some(function (element) {
      return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
    });
  }

  var selInput = 'input,select,textarea,button';

  function isInput(element) {
    return toNodes(element).some(function (element) {
      return matches(element, selInput);
    });
  }

  function filter(element, selector) {
    return toNodes(element).filter(function (element) {
      return matches(element, selector);
    });
  }

  function within(element, selector) {
    return !isString(selector) ? element === selector || (isDocument(selector) ? selector.documentElement : toNode(selector)).contains(toNode(element)) // IE 11 document does not implement contains
    : matches(element, selector) || !!closest(element, selector);
  }

  function parents(element, selector) {
    var elements = [];

    while (element = parent(element)) {
      if (!selector || matches(element, selector)) {
        elements.push(element);
      }
    }

    return elements;
  }

  function children(element, selector) {
    element = toNode(element);
    var children = element ? toNodes(element.children) : [];
    return selector ? filter(children, selector) : children;
  }

  function on() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    var _getArgs$ = getArgs$1(args),
        _getArgs$2 = _slicedToArray(_getArgs$, 5),
        targets = _getArgs$2[0],
        type = _getArgs$2[1],
        selector = _getArgs$2[2],
        listener = _getArgs$2[3],
        useCapture = _getArgs$2[4];

    console.log(useCapture);
    targets = toEventTargets(targets);

    if (listener.length > 1) {
      listener = detail(listener);
    }

    if (useCapture && useCapture.self) {
      listener = selfFilter(listener);
    }

    if (selector) {
      listener = delegate(targets, selector, listener);
    }

    useCapture = useCaptureFilter(useCapture);
    type.split(' ').forEach(function (type) {
      return targets.forEach(function (target) {
        return target.addEventListener(type, listener, useCapture);
      });
    });
    return function () {
      return off(targets, type, listener, useCapture);
    };
  }

  function off(targets, type, listener) {
    var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    useCapture = useCaptureFilter(useCapture);
    targets = toEventTargets(targets);
    type.split(' ').forEach(function (type) {
      return targets.forEach(function (target) {
        return target.removeEventListener(type, listener, useCapture);
      });
    });
  }

  function once() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    var _getArgs$3 = getArgs$1(args),
        _getArgs$4 = _slicedToArray(_getArgs$3, 6),
        element = _getArgs$4[0],
        type = _getArgs$4[1],
        selector = _getArgs$4[2],
        listener = _getArgs$4[3],
        useCapture = _getArgs$4[4],
        condition = _getArgs$4[5];

    var off = on(element, type, selector, function (e) {
      var result = !condition || condition(e);

      if (result) {
        off();
        listener(e, result);
      }
    }, useCapture);
    return off;
  }

  function trigger(targets, event, detail) {
    return toEventTargets(targets).reduce(function (notCanceled, target) {
      return notCanceled && target.dispatchEvent(createEvent(event, true, true, detail));
    }, true);
  }

  function createEvent(e) {
    var bubbles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var cancelable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var detail = arguments.length > 3 ? arguments[3] : undefined;

    if (isString(e)) {
      var event = document.createEvent('CustomEvent'); // IE 11

      event.initCustomEvent(e, bubbles, cancelable, detail);
      e = event;
    }

    return e;
  }

  function getArgs$1(args) {
    console.log(args);

    if (isFunction(args[2])) {
      args.splice(2, 0, false);
    }

    return args;
  }

  function delegate(delegates, selector, listener) {
    var _this4 = this;

    return function (e) {
      delegates.forEach(function (delegate) {
        var current = selector[0] === '>' ? findAll(selector, delegate).reverse().filter(function (element) {
          return within(e.target, element);
        })[0] : closest(e.target, selector);

        if (current) {
          e.delegate = delegate;
          e.current = current;
          listener.call(_this4, e);
        }
      });
    };
  }

  function detail(listener) {
    return function (e) {
      return isArray(e.detail) ? listener.apply(void 0, [e].concat(_toConsumableArray(e.detail))) : listener(e);
    };
  }

  function selfFilter(listener) {
    return function (e) {
      if (e.target === e.currentTarget || e.target === e.current) {
        return listener.call(null, e);
      }
    };
  }

  function useCaptureFilter(options) {
    return options && isIE && !isBoolean(options) ? !!options.capture : options;
  }

  function isEventTarget(target) {
    return target && 'addEventListener' in target;
  }

  function toEventTarget(target) {
    return isEventTarget(target) ? target : toNode(target);
  }

  function toEventTargets(target) {
    return isArray(target) ? target.map(toEventTarget).filter(Boolean) : isString(target) ? findAll(target) : isEventTarget(target) ? [target] : toNodes(target);
  }

  function isTouch(e) {
    return e.pointerType === 'touch' || !!e.touches;
  }

  function getEventPos(e) {
    var touches = e.touches,
        changedTouches = e.changedTouches;

    var _ref3 = touches && touches[0] || changedTouches && changedTouches[0] || e,
        x = _ref3.clientX,
        y = _ref3.clientY;

    return {
      x: x,
      y: y
    };
  }

  var util =
  /*#__PURE__*/
  Object.freeze({
    addClass: addClass,
    removeClass: removeClass,
    replaceClass: replaceClass,
    hasClass: hasClass,
    toggleClass: toggleClass,
    test: test,
    attr: attr,
    hasAttr: hasAttr,
    removeAttr: removeAttr,
    inBrowser: inBrowser,
    isIE: isIE,
    isRtl: isRtl,
    hasTouch: hasTouch,
    pointerDown: pointerDown,
    pointerMove: pointerMove,
    pointerUp: pointerUp,
    pointerEnter: pointerEnter,
    pointerLeave: pointerLeave,
    pointerCancel: pointerCancel,
    query: query,
    queryAll: queryAll,
    find: find,
    findAll: findAll,
    matches: matches,
    closest: closest,
    parent: parent,
    escape: escape,
    Promise: Promise,
    Deferred: Deferred,
    isVoidElement: isVoidElement,
    isVisible: isVisible,
    selInput: selInput,
    isInput: isInput,
    filter: filter,
    within: within,
    parents: parents,
    children: children,
    on: on,
    off: off,
    once: once,
    trigger: trigger,
    createEvent: createEvent,
    toEventTargets: toEventTargets,
    isTouch: isTouch,
    getEventPos: getEventPos
  }); // import * as util from 'uikit-util';
  // import {addC33lass} from './util/index.js';

  var testBtn = document.querySelector('#testBtn');
  console.log(Element.prototype);
  var el = document.querySelectorAll('.test'); // console.log(el)

  addClass(el, ['aaaaa', 'bbbbder']);
  console.log(hasClass(el, 'aacdsfswerwe'));
  console.log(util);
  test(); // testBtn.addEventListener('click', function(e){
  //     util.toggleClass(el, 'aaabbbdfa')
  // }, false)
  // on(testBtn, 'click', function(){
  //     console.log(this)
  // })

  on(testBtn, 'click', function (e) {
    console.log(undefined);
  }); // window.frontui = util;

  return util;
});