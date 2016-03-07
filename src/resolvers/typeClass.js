"use strict";

import {isString,isArray, slice, isFunction, push} from '../tutils';

export const settings = {
    inputClassName:'form-control'
};

export function addClasses(classes, ...rest) {
    if (rest == null || rest.length === 0) {
        return classes;
    }
    for (let i = 0, l = rest.length; i < l; i++) {
        const str = rest[i];

        if (str == null) continue;

        if (isString(str)) {
            const parts = str.split(/\s+?/);

            if (parts.length > 1) {

                addClasses(classes, ...parts);

            } else {

                if (classes.indexOf(str) === -1) {
                    classes.push(str);
                }
            }
        } else if (isArray(str)) {
            addClasses(classes, ...str);

        } else if (isFunction(str)) {
            addClasses(classes, this::str());
        }
    }
    return classes;
}

/**
 * Determines the classes for a type.
 * Takes a react node as the first argument.
 * @param {Reactnode} node - node to create for.
 * @param {String|Function|Array<String|Function|Array>} [clases] -classes to add.
 */
export function forType(OrigClazz, value) {
    return addClasses([], value || OrigClazz.inputClassName || settings.inputClassName).join(' ');
}

export default function typeClass(Clazz, key, propList, OrigClazz) {

    Clazz::this.property(key, function (value) {
        return forType(OrigClazz, value);
    });
}