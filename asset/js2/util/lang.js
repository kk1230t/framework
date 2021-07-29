const objPrototype = Object.prototype;
const {hasOwnProperty} = objPrototype;  

export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}



const strPrototype = String.prototype;
const startsWithFn = strPrototype.startsWith || function (search) { return this.lastIndexOf(search, 0) === 0; };

export function startsWith(str, search) {
    return startsWithFn.call(str, search);
}

const endsWithFn = strPrototype.endsWith || function (search) { return this.substr(-search.length) === search; };

export function endsWith(str, search) {
    return endsWithFn.call(str, search);
}



const arrPrototype = Array.prototype;

const includesFn = function (search, i) { return !!~this.indexOf(search, i); };
const includesStr = strPrototype.includes || includesFn;
const includesArray = arrPrototype.includes || includesFn;

export function includes(obj, search) {
    return obj && (isString(obj) ? includesStr : includesArray).call(obj, search);
}

export function noop() {}



export function isBoolean(value) {
    return typeof value === 'boolean';
}

export function isString(value) {
    return typeof value === 'string';
}

export function isNumber(value) {
    return typeof value === 'number';
}

export function isUndefined(value) {
    return value === void 0;
}

export function isFunction(obj) {
    return typeof obj === 'function';
}

export function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

export function last(array) {
    return array[array.length - 1];
}


const {toString} = objPrototype;
export function isPlainObject(obj) {
    return toString.call(obj) === '[object Object]';
}

export function isWindow(obj) {
    return isObject(obj) && obj === obj.window;
}

export function isDocument(obj) {
    return isObject(obj) && obj.nodeType === 9;
}

export function isJQuery(obj) {
    return isObject(obj) && !!obj.jquery;
}

export function isNode(obj) {
    return isObject(obj) && obj.nodeType >= 1;
}

export function isElement(obj) {
    return isObject(obj) && obj.nodeType === 1;
}


export function isNodeCollection(obj) {
    return toString.call(obj).match(/^\[object (NodeList|HTMLCollection)\]$/);
}

export const {isArray} = Array;


export function toNode(element) {
    return isNode(element)
        ? element
        : isNodeCollection(element) || isJQuery(element)
            ? element[0]
            : isArray(element)
                ? toNode(element[0])
                : null;
}

export function toNodes(element) {
    return isNode(element)
        ? [element]
        : isNodeCollection(element)
            ? arrPrototype.slice.call(element)
            : isArray(element)
                ? element.map(toNode).filter(Boolean)
                : isJQuery(element)
                    ? element.toArray()
                    : [];
}
