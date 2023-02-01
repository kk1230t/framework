import {isFunction, isObject, isUndefined, toNode, toNodes} from './lang.js';

/**
 * 신규 속성 적용
 * @param {Object} element 엘리먼트
 * @param {String} name 속성 이름
 * @param {String} value 속성 값
 * @returns undefined
 */
export function attr(element, name, value) {
    if (isObject(name)) {
        
        for (const key in name) {
            attr(element, key, name[key]);
        }
        return;
    }

    if (isUndefined(value)) {
        element = toNode(element);
        return element && element.getAttribute(name);
    } else {
        toNodes(element).forEach(element => {

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

/**
 * 전달된 속성 값이 존재하는가
 * @param {Object} element 
 * @param {String} name 확인할 속성 값
 * @returns Boolean
 */
export function hasAttr(element, name) {
    return toNodes(element).some(element => element.hasAttribute(name));
}

/**
 *  속성 제거
 * @param {Object} element 
 * @param {String} name 제거할 속성 명
 */
export function removeAttr(element, name) {
    element = toNodes(element);
    name.split(' ').forEach(name =>
        element.forEach(element =>
            element.hasAttribute(name) && element.removeAttribute(name)
        )
    );
}

export function data(element, attribute) {
    for (let i = 0, attrs = [attribute, `data-${attribute}`]; i < attrs.length; i++) {
        if (hasAttr(element, attrs[i])) {
            return attr(element, attrs[i]);
        }
    }
}
