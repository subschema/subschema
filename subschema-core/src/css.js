"use strict";

import {isString,isArray, slice, isFunction, push} from './tutils';


export function addClasses(classes, str) {
    if (str == null) {
        return;
    }
    if (isString(str)) {
        push(classes, str.split(/\s+?/));
    }
    if (isArray(str)) {
        str.forEach((v)=>addClasses(classes, v));
    }
    if (isFunction(str)) {
        addClasses(classes, str.call(this));
    }

}

export function addClass(node, className) {
    if (className) {
        if (node.classList) {
            node.classList.add(className);
        } else if (!api.hasClass(node, className)) {
            node.className = node.className + ' ' + className;
        }
    }
    return node;
}

export function hasClass(node, className) {
    if (node.classList) {
        return !!className && node.classList.contains(className);
    }
    return node.className.split(/\s+?/).indexOf(className) > -1;
}


export function removeClass(node, className) {
    if (className) {
        if (node.classList) {
            node.classList.remove(className);
        } else {
            var parts = node.className.split(/\s+?/), idx;
            while ((idx = parts.indexOf(className)) > -1) {
                parts.splice(idx, 1)
            }
            node.className = parts.join(' ');
        }
    }
    return node;
}

export default {
    hasClass,
    removeClass,
    addClass,
    addClasses
};