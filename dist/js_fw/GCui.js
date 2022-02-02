(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.GCui = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var objPrototype = Object.prototype;
  var hasOwnProperty = objPrototype.hasOwnProperty;
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }
  var hyphenateRe = /\B([A-Z])/g;
  /**
   * example 
   * @from    'abcdAbcdAbcd' 
   * @to      'abcd-abcd-abcd'
   */

  var hyphenate = memoize(function (str) {
    return str.replace(hyphenateRe, '-$1').toLowerCase();
  });
  var camelizeRe = /-(\w)/g;
  var camelize = memoize(function (str) {
    return str.replace(camelizeRe, toUpper);
  });
  var ucfirst = memoize(function (str) {
    return str.length ? toUpper(null, str.charAt(0)) + str.slice(1) : '';
  });

  function toUpper(_, c) {
    return c ? c.toUpperCase() : '';
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
  var isArray = Array.isArray;
  function isFunction(obj) {
    return typeof obj === 'function';
  }
  function isObject(obj) {
    return obj !== null && _typeof(obj) === 'object';
  }
  var toString = objPrototype.toString;
  function isPlainObject(obj) {
    return toString.call(obj) === '[object Object]';
  }
  function isWindow(obj) {
    return isObject(obj) && obj === obj.window;
  }
  function isDocument(obj) {
    return nodeType(obj) === 9;
  }
  function isNode(obj) {
    return nodeType(obj) >= 1;
  }
  function isElement(obj) {
    return nodeType(obj) === 1;
  }

  function nodeType(obj) {
    return !isWindow(obj) && isObject(obj) && obj.nodeType;
  }

  function isBoolean(value) {
    return typeof value === 'boolean';
  }
  function isString(value) {
    return typeof value === 'string';
  }
  function isNumber(value) {
    return typeof value === 'number';
  }
  function isNumeric(value) {
    return isNumber(value) || isString(value) && !isNaN(value - parseFloat(value));
  }
  function isUndefined$1(value) {
    return value === void 0;
  }
  function toFloat(value) {
    return parseFloat(value) || 0;
  }
  var toArray = Array.from || function (value) {
    return arrPrototype.slice.call(value);
  };
  function toNode(element) {
    return toNodes(element)[0];
  }
  function toNodes(element) {
    return element && (isNode(element) ? [element] : toArray(element).filter(isNode)) || [];
  }
  function toWindow(element) {
    if (isWindow(element)) {
      return element;
    }

    element = toNode(element);
    return element ? (isDocument(element) ? element : element.ownerDocument).defaultView : window;
  }
  var assign = Object.assign || function (target) {
    target = Object(target);

    for (var i = 0; i < (arguments.length <= 1 ? 0 : arguments.length - 1); i++) {
      var source = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];

      if (source !== null) {
        for (var key in source) {
          if (hasOwn(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }

    return target;
  };
  function each(obj, cb) {
    for (var key in obj) {
      if (false === cb(obj[key], key)) {
        return false;
      }
    }

    return true;
  }
  function sortBy(array, prop) {
    return array.slice().sort(function (_ref, _ref2) {
      var _ref$prop = _ref[prop],
          propA = _ref$prop === void 0 ? 0 : _ref$prop;
      var _ref2$prop = _ref2[prop],
          propB = _ref2$prop === void 0 ? 0 : _ref2$prop;
      return propA > propB ? 1 : propB > propA ? -1 : 0;
    });
  }
  function noop() {}
  function memoize(fn) {
    var cache = Object.create(null);
    return function (key) {
      return cache[key] || (cache[key] = fn(key));
    };
  }

  function attr(element, name, value) {
    if (isObject(name)) {
      for (var key in name) {
        attr(element, key, name[key]);
      }

      return;
    }

    if (isUndefined$1(value)) {
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

  var inBrowser$1 = typeof window !== 'undefined';
  inBrowser$1 && /msie|trident/i.test(window.navigator.userAgent);
  inBrowser$1 && attr(document.documentElement, 'dir') === 'rtl';
  var hasTouchEvents$1 = inBrowser$1 && 'ontouchstart' in window;
  inBrowser$1 && (hasTouchEvents$1 || window.DocumentTouch && document instanceof DocumentTouch || navigator.maxTouchPoints); // IE >=11

  var Promise$1 = inBrowser$1 && window.Promise || PromiseFn;
  /**
   * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
   */
  //  var Promise = window.Promise || PromiseFn;

  var RESOLVED = 0;
  var REJECTED = 1;
  var PENDING = 2;
  var async = inBrowser$1 && window.setImmediate || setTimeout;

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

  p["catch"] = function (onRejected) {
    return this.then(undefined, onRejected);
  };

  /* global DocumentTouch */
  var inBrowser = typeof window !== 'undefined';
  var isIE = inBrowser && /msie|trident/i.test(window.navigator.userAgent);
  inBrowser && attr(document.documentElement, 'dir') === 'rtl';
  var hasTouchEvents = inBrowser && 'ontouchstart' in window;
  inBrowser && (hasTouchEvents || window.DocumentTouch && document instanceof DocumentTouch || navigator.maxTouchPoints); // IE >=11

  function parent(element) {
    element = toNode(element);
    return element && isElement(element.parentNode) && element.parentNode;
  }
  function filter(element, selector) {
    return toNodes(element).filter(function (element) {
      return matches(element, selector);
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
  function index(element, ref) {
    return ref ? toNodes(element).indexOf(toNode(ref)) : children(parent(element)).indexOf(element);
  }

  function findAll(selector, context) {
    return toNodes(_query(selector, context, 'querySelectorAll'));
  }

  function _query(selector) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    var queryFn = arguments.length > 2 ? arguments[2] : undefined;

    if (!selector || !isString(selector)) {
      return selector;
    }

    selector = selector.replace(contextSanitizeRe, '$1 *');

    if (isContextSelector(selector)) {
      selector = splitSelector(selector).map(function (selector) {
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

        return "".concat(domPath(ctx), " ").concat(selector);
      }).filter(Boolean).join(',');
      context = document;
    }

    try {
      return context[queryFn](selector);
    } catch (e) {
      return null;
    }
  }

  var contextSelectorRe = /(^|[^\\],)\s*[!>+~-]/;
  var contextSanitizeRe = /([!>+~-])(?=\s+[!>+~-]|\s*$)/g;
  var isContextSelector = memoize(function (selector) {
    return selector.match(contextSelectorRe);
  });
  var selectorRe = /.*?[^\\](?:,|$)/g;
  var splitSelector = memoize(function (selector) {
    return selector.match(selectorRe).map(function (selector) {
      return selector.replace(/,$/, '').trim();
    });
  });

  function domPath(element) {
    var names = [];

    while (element.parentNode) {
      if (element.id) {
        names.unshift("#".concat(escape(element.id)));
        break;
      } else {
        var _element = element,
            tagName = _element.tagName;

        if (tagName !== 'HTML') {
          tagName += ":nth-child(".concat(index(element) + 1, ")");
        }

        names.unshift(tagName);
        element = element.parentNode;
      }
    }

    return names.join(' > ');
  }

  var escapeFn = inBrowser && window.CSS && CSS.escape || function (css) {
    return css.replace(/([^\x7f-\uFFFF\w-])/g, function (match) {
      return "\\".concat(match);
    });
  };

  function escape(css) {
    return isString(css) ? escapeFn.call(null, css) : '';
  }

  function on() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // console.log(args);
    var _getArgs = getArgs(args),
        _getArgs2 = _slicedToArray(_getArgs, 5),
        targets = _getArgs2[0],
        type = _getArgs2[1],
        selector = _getArgs2[2],
        listener = _getArgs2[3],
        useCapture = _getArgs2[4];

    targets = toEventTargets(targets);

    if (listener.length > 1) {
      listener = detail(listener);
    }

    if (useCapture && useCapture.self) {
      listener = selfFilter(listener);
    }

    if (selector) {
      listener = delegate(selector, listener);
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

  function getArgs(args) {
    if (isFunction(args[2])) {
      args.splice(2, 0, false);
    }

    return args;
  }

  function delegate(selector, listener) {
    var _this = this;

    return function (e) {
      var current = selector[0] === '>' ? findAll(selector, e.currentTarget).reverse().filter(function (element) {
        return within(e.target, element);
      })[0] : closest(e.target, selector);

      if (current) {
        e.current = current;
        listener.call(_this, e);
      }
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

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }

    var unbind = on(document, 'DOMContentLoaded', function () {
      unbind();
      fn();
    });
  }
  var fragmentRe = /^\s*<(\w+|!)[^>]*>/;
  var singleTagRe = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;
  function fragment(html) {
    var matches = singleTagRe.exec(html);

    if (matches) {
      return document.createElement(matches[1]);
    }

    var container = document.createElement('div');

    if (fragmentRe.test(html)) {
      container.insertAdjacentHTML('beforeend', html.trim());
    } else {
      container.textContent = html;
    }

    return container.childNodes.length > 1 ? toNodes(container.childNodes) : container.firstChild;
  }
  function apply(node, fn) {
    if (!isElement(node)) {
      return;
    }

    fn(node);
    node = node.firstElementChild;

    while (node) {
      var next = node.nextElementSibling;
      apply(node, fn);
      node = next;
    }
  }
  function $$(selector, context) {
    return isHtml(selector) ? toNodes(fragment(selector)) : findAll(selector, context);
  }

  function isHtml(str) {
    return isString(str) && (str[0] === '<' || str.match(/^\s*</));
  }

  var cssNumber = {
    'animation-iteration-count': true,
    'column-count': true,
    'fill-opacity': true,
    'flex-grow': true,
    'flex-shrink': true,
    'font-weight': true,
    'line-height': true,
    'opacity': true,
    'order': true,
    'orphans': true,
    'stroke-dasharray': true,
    'stroke-dashoffset': true,
    'widows': true,
    'z-index': true,
    'zoom': true
  };
  function css(element, property, value) {
    var priority = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    return toNodes(element).map(function (element) {
      if (isString(property)) {
        property = propName(property);

        if (isUndefined$1(value)) {
          return getStyle(element, property);
        } else if (!value && !isNumber(value)) {
          element.style.removeProperty(property);
        } else {
          element.style.setProperty(property, isNumeric(value) && !cssNumber[property] ? "".concat(value, "px") : value, priority);
        }
      } else if (isArray(property)) {
        var styles = getStyles(element);
        return property.reduce(function (props, property) {
          props[property] = styles[propName(property)];
          return props;
        }, {});
      } else if (isObject(property)) {
        priority = value;
        each(property, function (value, property) {
          return css(element, property, value, priority);
        });
      }

      return element;
    })[0];
  }

  function getStyles(element, pseudoElt) {
    return toWindow(element).getComputedStyle(element, pseudoElt);
  }

  function getStyle(element, property, pseudoElt) {
    return getStyles(element, pseudoElt)[property];
  }

  var propName = memoize(function (name) {
    return vendorPropName(name);
  });
  var cssPrefixes = ['webkit', 'moz', 'ms'];

  function vendorPropName(name) {
    name = hyphenate(name);
    var style = document.documentElement.style;

    if (name in style) {
      return name;
    }

    var i = cssPrefixes.length,
        prefixedName;

    while (i--) {
      prefixedName = "-".concat(cssPrefixes[i], "-").concat(name);

      if (prefixedName in style) {
        return prefixedName;
      }
    }
  }

  var dirs = {
    width: ['left', 'right'],
    height: ['top', 'bottom']
  };
  dimension('height');
  dimension('width');

  function dimension(prop) {
    var propName = ucfirst(prop);
    return function (element, value) {
      if (isUndefined$1(value)) {
        if (isWindow(element)) {
          return element["inner".concat(propName)];
        }

        if (isDocument(element)) {
          var doc = element.documentElement;
          return Math.max(doc["offset".concat(propName)], doc["scroll".concat(propName)]);
        }

        element = toNode(element);
        value = css(element, prop);
        value = value === 'auto' ? element["offset".concat(propName)] : toFloat(value) || 0;
        return value - boxModelAdjust(element, prop);
      } else {
        return css(element, prop, !value && value !== 0 ? '' : +value + boxModelAdjust(element, prop) + 'px');
      }
    };
  }

  function boxModelAdjust(element, prop) {
    var sizing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'border-box';
    return css(element, 'boxSizing') === sizing ? dirs[prop].map(ucfirst).reduce(function (value, prop) {
      return value + toFloat(css(element, "padding".concat(prop))) + toFloat(css(element, "border".concat(prop, "Width")));
    }, 0) : 0;
  }

  var strats = {};
  strats.events = strats.created = strats.beforeConnect = strats.connected = strats.beforeDisconnect = strats.disconnected = strats.destroy = concatStrat; // args strategy

  strats.args = function (parentVal, childVal) {
    return childVal !== false && concatStrat(childVal || parentVal);
  }; // update strategy


  strats.update = function (parentVal, childVal) {
    return sortBy(concatStrat(parentVal, isFunction(childVal) ? {
      read: childVal
    } : childVal), 'order');
  }; // property strategy


  strats.props = function (parentVal, childVal) {
    if (isArray(childVal)) {
      childVal = childVal.reduce(function (value, key) {
        value[key] = String;
        return value;
      }, {});
    }

    return strats.methods(parentVal, childVal);
  }; // extend strategy


  strats.computed = strats.methods = function (parentVal, childVal) {
    return childVal ? parentVal ? assign({}, parentVal, childVal) : childVal : parentVal;
  }; // data strategy


  strats.data = function (parentVal, childVal, vm) {
    if (!vm) {
      if (!childVal) {
        return parentVal;
      }

      if (!parentVal) {
        return childVal;
      }

      return function (vm) {
        return mergeFnData(parentVal, childVal, vm);
      };
    }

    return mergeFnData(parentVal, childVal, vm);
  };

  function mergeFnData(parentVal, childVal, vm) {
    return strats.computed(isFunction(parentVal) ? parentVal.call(vm, vm) : parentVal, isFunction(childVal) ? childVal.call(vm, vm) : childVal);
  } // concat strategy


  function concatStrat(parentVal, childVal) {
    parentVal = parentVal && !isArray(parentVal) ? [parentVal] : parentVal;
    return childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
  } // default strategy


  function defaultStrat(parentVal, childVal) {
    return isUndefined$1(childVal) ? parentVal : childVal;
  }

  function mergeOptions(parent, child, vm) {
    var options = {};

    if (isFunction(child)) {
      child = child.options;
    }

    if (child["extends"]) {
      parent = mergeOptions(parent, child["extends"], vm);
    }

    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }

    for (var key in parent) {
      mergeKey(key);
    }

    for (var _key in child) {
      if (!hasOwn(parent, _key)) {
        mergeKey(_key);
      }
    }

    function mergeKey(key) {
      options[key] = (strats[key] || defaultStrat)(parent[key], child[key], vm);
    }

    return options;
  }

  /*
      Based on:
      Copyright (c) 2016 Wilson Page wilsonpage@me.com
      https://github.com/wilsonpage/fastdom
  */

  var fastdom = {
    reads: [],
    writes: [],
    read: function read(task) {
      this.reads.push(task);
      scheduleFlush();
      return task;
    },
    write: function write(task) {
      this.writes.push(task);
      scheduleFlush();
      return task;
    },
    clear: function clear(task) {
      remove$1(this.reads, task);
      remove$1(this.writes, task);
    },
    flush: flush
  };

  function flush() {
    var recursion = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    runTasks(fastdom.reads);
    runTasks(fastdom.writes.splice(0));
    fastdom.scheduled = false;

    if (fastdom.reads.length || fastdom.writes.length) {
      scheduleFlush(recursion + 1);
    }
  }

  var RECURSION_LIMIT = 4;

  function scheduleFlush(recursion) {
    if (fastdom.scheduled) {
      return;
    }

    fastdom.scheduled = true;

    if (recursion && recursion < RECURSION_LIMIT) {
      Promise$1.resolve().then(function () {
        return flush(recursion);
      });
    } else {
      requestAnimationFrame(function () {
        return flush();
      });
    }
  }

  function runTasks(tasks) {
    var task;

    while (task = tasks.shift()) {
      try {
        task();
      } catch (e) {
        console.error(e);
      }
    }
  }

  function remove$1(array, item) {
    var index = array.indexOf(item);
    return ~index && array.splice(index, 1);
  }

  function globalApi (UICommon) {
    var DATA = UICommon.data;

    UICommon.use = function (plugin) {
      if (plugin.installed) return;
      plugin.call(null, this);
      plugin.installed = true;
      return this;
    };

    UICommon.extend = function (opts) {
      var options = opts || {};
      var Super = this;

      var Sub = function GCuiComponent(options) {
        this._init(options);
      };

      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.options = mergeOptions(Super.options, options);
      Sub["super"] = Super;
      Sub.extend = Super.extend;
      return Sub;
    };

    UICommon.update = function (element, e) {
      element = element ? toNode(element) : document.body;
      parents(element).reverse().forEach(function (element) {
        return update(element[DATA], e);
      });
      apply(element, function (element) {
        return update(element[DATA], e);
      });
    };

    Object.defineProperty(UICommon, 'container', {
      get: function get() {
        return container || document.body;
      },
      set: function set(element) {
        container = $(element);
      }
    });

    function update(data, e) {
      if (!data) {
        return;
      }

      for (var name in data) {
        if (data[name]._connected) {
          data[name]._callUpdate(e);
        }
      }
    }
  }

  function initializeApi (UICommon) {
    var uid = 0;

    UICommon.prototype._init = function (opts) {
      var options = opts || {};
      options.data = normalizeData(options, this.constructor.options);
      this.$options = mergeOptions(this.constructor.options, options, this);
      this.$el = null;
      this.$props = {};
      this._uid = uid++; // console.log(this.options)

      this._initData();

      this._initMethods();

      this._initComputeds();

      if (options.el) {
        this.$mount(options.el);
      }
    };

    UICommon.prototype._initData = function () {
      var _ = this;

      var _this$$options$data = this.$options.data,
          data = _this$$options$data === void 0 ? {} : _this$$options$data;

      for (var key in data) {
        _.$props[key] = data[key];
      }
    };

    UICommon.prototype._initMethods = function () {
      var _ = this;

      var methods = this.$options.methods;

      if (methods) {
        for (var key in methods) {
          _[key] = methods[key].bind(_);
        }
      }
    };

    UICommon.prototype._initComputeds = function () {
      var _ = this;

      var computed = this.$options.computed;
      _._computeds = {};

      if (computed) {
        for (var key in computed) {
          registerComputed(_, key, computed[key]);
        }
      }
    };

    UICommon.prototype._initEvents = function () {
      this._events = [];

      var _ = this;

      var events = _.$options.events;

      if (events) {
        events.forEach(function (event) {
          if (!hasOwn(event, 'handler')) {
            for (var key in event) {
              registerEvent(_, event[key], key);
            }
          } else {
            registerEvent(_, event);
          }
        });
      }
    };

    UICommon.prototype._callHook = function (hook) {
      var _this = this;

      var handlers = this.$options[hook];
      if (handlers) handlers.forEach(function (handlers) {
        return handlers.call(_this);
      });
    };

    UICommon.prototype._callConnected = function () {
      if (this._connected) return;
      this._data = {};
      this._computeds = {};
      this._frames = {
        reads: {},
        writes: {}
      }; // this._initProps();

      this._callHook('beforeConnect');

      this._connected = true;

      this._initEvents(); // this._initObserver();


      this._callHook('connected');

      this._callUpdate();
    };

    UICommon.prototype._callDisconnected = function () {
      if (!this_connected) return;

      this._callHook('beforeDisconnect');

      if (this._observer) {
        this._observer.disconnect();

        this._observer = null;
      }

      this._unbindEvents();

      this._callHook('disconnected');

      this._connected = false;
    };

    UICommon.prototype._callUpdate = function () {
      var _this2 = this;

      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'update';
      var type = e.type || e;

      if (includes(['update', 'resize'], type)) {
        this._callWatches();
      }

      var updates = this.$options.update;
      var _this$_frames = this._frames;
          _this$_frames.reads;
          var writes = _this$_frames.writes;
      if (!updates) return;
      updates.forEach(function (_ref, i) {
        var read = _ref.read,
            write = _ref.write,
            events = _ref.events;
        if (type !== 'update' && !includes(events, type)) return;

        if (read && !includes(fastdom.reads, read[i])) {
          read[i] = fastdom.read(function () {
            var result = _this2._connected && read.call(_this2, _this2._data, type);

            if (result === false && write) {
              fastdom.clear(writes[i]);
            } else if (isPlainObject(result)) {
              assign(_this2._data, result);
            }
          });
        }

        if (write && !includes(fastdom.writes, writes[i])) {
          writes[i] = fastdom.write(function () {
            return _this2._connected && write.call(_this2, _this2._data, type);
          });
        }
      });
    };

    UICommon.prototype._callWatches = function () {
      var _this3 = this;

      var _frames = this._frames;

      if (_frames._watch) {
        return;
      }

      var initital = !hasOwn(_frames, '_watch');
      _frames._watch = fastdom.read(function () {
        if (!_this3._connected) {
          return;
        }

        var computed = _this3.$options.computed,
            _computeds = _this3._computeds;

        for (var key in computed) {
          var hasPrev = hasOwn(_computeds, key);
          var prev = _computeds[key];
          delete _computeds[key];
          var _computed$key = computed[key],
              watch = _computed$key.watch,
              immediate = _computed$key.immediate;

          if (watch && (initital && immediate || hasPrev && !isEqual(prev, _this3[key]))) {
            watch.call(_this3, _this3[key], prev);
          }
        }

        _frames._watch = null;
      });
    };
  }

  function registerEvent(component, event, key) {
    if (!isPlainObject(event)) {
      event = {
        name: key,
        handler: event
      };
    }

    var _event = event,
        name = _event.name,
        el = _event.el,
        handler = _event.handler,
        capture = _event.capture,
        passive = _event.passive,
        delegate = _event.delegate;
        _event.filter;
        var self = _event.self;
    el = el || component.$el;

    component._events.push(on(el, name, !delegate ? null : isString(delegate) ? delegate : delegate.call(component), isString(handler) ? component[handler] : handler.bind(component), {
      passive: passive,
      capture: capture,
      self: self
    })); // console.log(component.$el)

  }

  function normalizeData(_ref2, _ref3) {
    var data = _ref2.data,
        el = _ref2.el;
    var args = _ref3.args,
        _ref3$props = _ref3.props,
        props = _ref3$props === void 0 ? {} : _ref3$props;
    data = isArray(data) ? !isEmpty(args) ? data.slice(0, args.length).reduce(function (data, value, index) {
      if (isPlainObject(value)) {
        assign(data, value);
      } else {
        data[args[index]] = value;
      }

      return data;
    }, {}) : undefined : data;

    if (data) {
      for (var key in data) {
        if (isUndefined(data[key])) {
          delete data[key];
        } else {
          data[key] = props[key] ? coerce(props[key], data[key], el) : data[key];
        }
      }
    }

    return data;
  }

  function registerComputed(component, key, cb) {
    Object.defineProperty(component, key, {
      enumerable: true,
      get: function get() {
        var _computeds = component._computeds,
            $props = component.$props,
            $el = component.$el;

        if (!hasOwn(_computeds, key)) {
          _computeds[key] = (cb.get || cb).call(component, $props, $el);
        }

        return _computeds[key];
      },
      set: function set(value) {
        var _computeds = component._computeds;
        _computeds[key] = cb.set ? cb.set.call(component, value) : value;

        if (isUndefined(_computeds[key])) {
          delete _computeds[key];
        }
      }
    });
  }

  function instanceApi (UICommon) {
    var DATA = UICommon.data;

    UICommon.prototype.$mount = function (el) {
      var name = this.$options.name;

      if (!el[DATA]) {
        el[DATA] = {};
      }

      if (el[DATA][name]) return;
      el[DATA][name] = this;
      this.$el = this.$options.el = this.$options.el || el;

      if (within(el, document)) {
        this._callConnected();
      }
    };

    UICommon.prototype.$reset = function () {
      this._callDisconnected();

      this._callConnected();
    };

    UICommon.prototype.$destroy = function () {
      var removeEl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var _this$$options = this.$options,
          el = _this$$options.el,
          name = _this$$options.name;
      if (el) this._callDisconnected();

      this._callHook('destory');

      if (!el || !el[DATA]) return;
      delete el[DATA][name];
      if (!isEmpty(el[DATA])) delete el[DATA];
      if (removeEl) remove(this.$el);
    };

    UICommon.prototype.$emit = function (e) {
      this._callUpdate(e);
    };

    UICommon.prototype.$update = function () {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.$el;
      var e = arguments.length > 1 ? arguments[1] : undefined;
      UICommon.update(element, e);
    };

    UICommon.prototype.$getComponent = UICommon.getComponent;
    var names = {};
    Object.defineProperties(UICommon.prototype, {
      $container: Object.getOwnPropertyDescriptor(UICommon, 'container'),
      $name: {
        get: function get() {
          var name = this.$options.name;

          if (!names[name]) {
            names[name] = UICommon.prefix + hyphenate(name);
          }

          return names[name];
        }
      }
    });
  }

  var accordion = {
    props: {},
    data: {},
    computed: {},
    events: [{
      name: 'click',
      handler: function handler(e) {
        e.preventDefault(); // alert('dd')
      }
    }],
    methods: {}
  };

  var abcd = {
    props: {},
    data: {
      aaa: 'aaa',
      bbb: 'bbb',
      ccc: 'ccc'
    },
    computed: {},
    events: [{
      name: 'click',
      handler: function handler(e) {
        e.preventDefault();
        this.$emit('checkStatus');
        console.log('dfsdfsdf');
      }
    }, {
      name: 'scroll',
      el: window,
      handler: function handler() {// this.$emit('resize');
      }
    }],
    methods: {
      test: function test() {
        alert('dddddd');
      }
    },
    update: {
      read: function read(_ref) {
        _ref.test;
            _ref.aaaa;
        // console.log('resizeRead')
        // console.log(aaaa)
        // console.log(test)
        return {
          test: 'dddd',
          aaaa: 'dffadfsf'
        };
      },
      write: function write(_ref2) {
        _ref2.test;
        console.log('resizeWrite'); // console.log(test)
      },
      events: ['resize']
    }
  };

  var tab = {
    props: {},
    data: {
      aaa: 'aaa',
      bbb: 'bbb',
      ccc: 'ccc'
    },
    computed: {},
    events: [{
      name: 'click',
      handler: function handler(e) {
        e.preventDefault();
        this.$emit('checkStatus');
        console.log('dfsdfsdf');
      }
    }, {
      name: 'scroll',
      el: window,
      handler: function handler() {// this.$emit('resize');
      }
    }],
    methods: {
      test: function test() {
        alert('dddddd');
      }
    },
    update: {
      read: function read(_ref) {
        _ref.test;
            _ref.aaaa;
        // console.log('resizeRead')
        // console.log(aaaa)
        // console.log(test)
        return {
          test: 'dddd',
          aaaa: 'dffadfsf'
        };
      },
      write: function write(_ref2) {
        _ref2.test;
        console.log('resizeWrite'); // console.log(test)
      },
      events: ['resize']
    }
  };

  var button = {
    props: {},
    data: {
      aaa: 'aaa',
      bbb: 'bbb',
      ccc: 'ccc'
    },
    computed: {},
    events: [{
      name: 'click',
      handler: function handler(e) {
        e.preventDefault();
        this.$emit('checkStatus');
        console.log('dfsdfsdf');
      }
    }, {
      name: 'scroll',
      el: window,
      handler: function handler() {// this.$emit('resize');
      }
    }],
    methods: {
      test: function test() {
        alert('dddddd');
      }
    },
    update: {
      read: function read(_ref) {
        _ref.test;
            _ref.aaaa;
        // console.log('resizeRead')
        // console.log(aaaa)
        // console.log(test)
        return {
          test: 'dddd',
          aaaa: 'dffadfsf'
        };
      },
      write: function write(_ref2) {
        _ref2.test;
        console.log('resizeWrite'); // console.log(test)
      },
      events: ['resize']
    }
  };

  var components = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Accordion: accordion,
    Abcd: abcd,
    TAb: tab,
    Button: button
  });

  function componentCore (GCui) {
    var DATA = GCui.data;
    var components = {};

    GCui.component = function (name, options) {
      name = hyphenate(name);

      if (!options) {
        if (isPlainObject(components[name])) {
          components[name] = GCui.extend(components[name]);
        }

        return components[name];
      }

      GCui[name] = function (element, data) {
        var component = GCui.component(name);
        return component.options.functional ? new component({
          data: isPlainObject(element) ? element : Array.prototype.slice.call(arguments)
        }) : !element ? init(element) : $$(element).map(init)[0];

        function init(element) {
          var instance = GCui.getComponent(element, name); // console.log(instance)
          // console.log(new component({el: element, data}));

          if (instance) {
            if (!data) {
              return instance;
            } else {
              instance.$destroy();
            }
          }

          return new component({
            el: element,
            data: data
          });
        }
      };

      var opt = isPlainObject(options) ? assign({}, options) : options.options;
      opt.name = name; // if (opt.install) {
      //     opt.install(GCui, opt, name);
      // }

      if (GCui._initialized && !opt.functional) {
        fastdom.read(function () {
          return GCui[name]("[".concat(GCui.prefixName, "-").concat(id, "],[data-").concat(GCui.prefixName, "-").concat(id, "]"));
        });
      }

      return components[name] = isPlainObject(options) ? opt : options;
    };

    GCui.getComponents = function (element) {
      return element && element[DATA] || {};
    };

    GCui.getComponent = function (element, name) {
      return GCui.getComponents(element)[name];
    };

    GCui.connect = function (node) {
      if (node[DATA]) {
        for (var name in node[DATA]) {
          node[DATA][name]._callConnected();
        }
      }

      for (var i = 0; i < node.attributes.length; i++) {
        var _name = getComponentName(node.attributes[i].name);

        if (_name && _name in components) {
          GCui[_name](node);
        }
      }
    };

    GCui.disconnect = function (node) {
      for (var name in node[DATA]) {
        node[DATA][name]._callDisconnected();
      }
    };
  }
  function getComponentName(attribute) {
    return startsWith(attribute, "".concat(GCui.prefixName, "-")) || startsWith(attribute, "data-".concat(GCui.prefixName, "-")) ? camelize(attribute.replace("data-".concat(GCui.prefixName, "-"), '').replace("".concat(GCui.prefixName, "-"), '')) : false;
  }

  function setFramewrok (GCui) {
    var connect = GCui.connect,
        disconnect = GCui.disconnect;

    if (!window.MutationObserver) {
      console.log('not support MutationObserver');
      return;
    }

    fastdom.read(function () {
      if (document.body) {
        apply(document.body, connect);
      }

      new MutationObserver(function (mutations) {
        var updates = [];
        mutations.forEach(function (mutation) {
          applyMutation(mutation, updates);
        });
        updates.forEach(function (el) {
          GCui.update(el);
        });
      }).observe(document, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
      });
      GCui._initialized = true;
    });

    function applyMutation(mutation, updates) {
      var target = mutation.target,
          type = mutation.type; // console.log(mutation);

      var update = type !== 'attributes' ? applyChildList(mutation) : applyAttribute(mutation);

      if (update && !updates.some(function (element) {
        return element.contains(target);
      })) {
        updates.push(target.contains ? target : target.parentNode); // IE 11 text node does not implement contains
      }
    }

    function applyAttribute(_ref) {
      var target = _ref.target,
          attributeName = _ref.attributeName;

      if (attributeName === 'href') {
        return true;
      }

      var name = getComponentName(attributeName);

      if (!name || !(name in Framework)) {
        return;
      }

      if (hasAttr(target, attributeName)) {
        Framework[name](target);
        return true;
      }

      var component = Framework.getComponent(target, name);

      if (component) {
        component.$destroy();
        return true;
      }
    }

    function applyChildList(_ref2) {
      var addedNodes = _ref2.addedNodes,
          removedNodes = _ref2.removedNodes;

      for (var i = 0; i < addedNodes.length; i++) {
        apply(addedNodes[i], connect);
      }

      for (var _i = 0; _i < removedNodes.length; _i++) {
        apply(removedNodes[_i], disconnect);
      }

      return true;
    }
  }

  var GCui$1 = function GCui(options) {
    this._init(options);
  }; // GCui.util = util;


  GCui$1.data = 'uiComponents';
  GCui$1.prefixName = 'kui';
  GCui$1.prefix = "".concat(GCui$1.prefixName, "-");
  GCui$1.options = {};
  GCui$1.version = 1.0; // globalAPI Start

  globalApi(GCui$1); // globalAPI End
  // hooksAPI, stateAPI Start

  initializeApi(GCui$1); // hooksAPI End
  // componentAPI Start

  componentCore(GCui$1); // componentAPI End
  // instanceAPI Start

  instanceApi(GCui$1); // instanceAPI End
  // boot Start

  setFramewrok(GCui$1); // boot End

  each(components, function (component, name) {
    return GCui$1.component(name, component);
  });
  GCui$1.use(function (GCui) {
    inBrowser && ready(function () {
      GCui.update();
      on(window, 'load resize', function () {
        return GCui.update(null, 'resize');
      });
      var pending;
      on(window, 'scroll', function (e) {
        if (pending) {
          return;
        }

        pending = true;
        fastdom.write(function () {
          return pending = false;
        });
        GCui.update(null, e.type);
      }, {
        passive: true,
        capture: true
      });
    });
  });

  return GCui$1;

}));
//# sourceMappingURL=GCui.js.map
