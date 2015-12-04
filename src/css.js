"use strict";

import {isString,isArray, slice, isFunction, push} from './tutils';
import Constants from './Constants';

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
/**
 * Determines the classes for a field.
 * Takes a react node as the first argument.
 * @param {Reactnode} node - node to create for.
 * @param {String|Function|Array<String|Function|Array>} [clases] -classes to add.
 */
export function forField(node, className) {
    var classes = [];
    addClasses(classes, slice(arguments, 2));
    if (className) {
        addClasses(classes, className);
    } else if (node.constructor.inputClassName) {
        push(classes, node.constructor.inputClassName.split(/\s+?/));
    } else if (node.inputClassName) {
        push(classes, node.inputClassName.split(/\s+?/));
    } else {
        push(classes, Constants.inputClassName.split(/\s+?/));
    }
    return classes.join(' ');
}

export function forEditor(node) {
    var classes = [];
    addClasses(classes, slice(arguments, 1));
    var field = node.props.field;
    var className = node.props.fieldClsName || node.props.fieldClassName || node.props.fieldClass;

    if (className) {
        addClasses(classes, className);
    } else if (node.constructor.fieldClassName) {
        push(classes, node.constructor.inputClassName.split(/\s+?/));
    }
    if (field) {
        addClasses.call(node, classes, field.fieldClass);
        addClasses.call(node, classes, field.fieldCls);
    }
    return classes.join(' ');
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

export default {};