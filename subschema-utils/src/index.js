import extend from 'lodash/extend';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import isRegExp from 'lodash/isRegExp';
import isDate from 'lodash/isDate';
import isBoolean from 'lodash/isBoolean';
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import find from 'lodash/find';
import unique from 'lodash/uniq';
import noop from 'lodash/noop';
import each from 'lodash/each';
import values from 'lodash/values';
import warning from './warning';

export const FREEZE_OBJ = Object.freeze({});
export const FREEZE_ARR = Object.freeze([]);
export const flatten    = Function.apply.bind(Array.prototype.concat, []);
export const push       = Function.apply.bind(Array.prototype.push);
export const slice      = Function.call.bind(Array.prototype.slice);

export function returnFirst(value) {
    return value;
}

export function flattenFields(feildset) {
    if (!feildset) {
        return [];
    }
    if (feildset.fields) {
        return feildset.fields;
    }
    if (Array.isArray(feildset)) {
        return feildset.reduce(function (ret, fs) {
            ret.push(...flattenFields(fs));
            return ret;
        }, []);
    }

    if (feildset.fieldsets) {
        return flattenFields(feildset.fieldsets);
    }
    return [];

}
export function resolveKey(path, key) {
    if (!key) {
        return path;
    }
    if (key[0] != '.') {
        return key;
    }
    var parts = path ? path.split('.') : [];
    key       = key.substring(1);
    while (key[0] === '.') {
        key = key.substring(1);
        parts.pop();
    }
    if (key) {
        parts.push(key);
    }
    return parts.length === 0 ? null : parts.join('.');
}

export function result(scope, key) {
    if (!key) {
        return null;
    }
    if (typeof key === 'string') {
        return result(scope, scope[key]);
    }
    if (typeof key === 'function') {
        return key.call(scope);
    }
    return key;
}

export function path() {
    var args = slice(arguments), l = args.length, i = 0, j = 0, p;
    var ret  = '';
    for (; i < l; i++) {
        p = args[i];
        if (p == null || p === '') {
            continue;
        }
        ret += (j++ === 0) ? p : "." + p;
    }
    return ret;
}

export function toArray(v) {
    if (isArray(v)) {
        return v;
    }
    if (isString(v)) {
        return v.split(/\,\s*/);
    }
    if (v == null) {
        return [];
    }
    return [v];
}

export function xtend(dest, args) {
    dest = dest || {};
    for (var i = 1, l = arguments.length; i < l; i++) {
        var arg = arguments[1];
        if (arg == null) {
            continue;
        }
        for (var j in arg) {
            dest[j] = args[j];
        }
    }
    return dest;
}

export function clone(t) {
    if (t == null) {
        return t;
    }
    var tt = typeof t;
    if (tt == 'boolean' || tt === 'number' || tt === 'string' || tt
                                                                 === 'function'
        || tt === 'symbol') {
        return t;
    }
    if (isArray(t)) {
        return t.concat();
    }
    if (t instanceof Date) {
        return new Date(t.getTime());
    }
    return extend({}, t);
}

export function debounce(fn, to) {
    var ti;

    return function f() {
        clearTimeout(ti);
        var args = Array.prototype.slice.call(arguments), self = this;
        ti       = setTimeout(function () {
            fn.apply(self, args);
        }, to);
    }
}

export function nullCheck(v) {
    return v != null;
}

export function emptyCheck(v) {
    return v != null && v.length > 0;
}

export function uppercase(v) {
    return v == null ? null : ('' + v).toUpperCase();
}

export function titlelize(value) {
    return ((value || '') + '').replace(/([A-Z])/g, ' $1')
                               .replace(/^./, uppercase);
}

export function applyFuncs(f1, f2) {
    if (f1 && !f2) {
        return f1;
    }
    if (!f1 && f2) {
        return f2;
    }
    return function applyFuncs$bothFuncs(...args) {
        f1.apply(this, args);
        f2.apply(this, args);
    };
}

export function inherits(Clazz) {
    let Proto = this;
    do {
        if (Proto === Clazz) {
            return true;
        }
        Proto = Object.getPrototypeOf(Proto);
    } while (Proto !== Object && Proto != null);
    return false;
}
/**
 * When f1 and f2 are defined-
 *
 * Calls f1 and f2 if f1 and f2 are defined and f1 does not return false.
 * If f1 returns false, f2 is not called.
 *
 * If f2 is not defined f1 is returned.
 * if f1 is not defined f2 is returned.
 *
 * @param f1
 * @param f2
 * @returns {function}
 */
export function nextFunc(f1, f2) {
    if (f1 && !f2) {
        return f1;
    }
    if (f2 && !f1) {
        return f2;
    }
    return function nextFunc$wrapper(...args) {
        if (f1.apply(this, args) !== false) {
            return f2.apply(this, args);
        }
    };
}

export {
    extend,
    isFunction,
    isString,
    isRegExp,
    isDate,
    isBoolean,
    isArray,
    isNumber,
    isObject,
    find,
    unique,
    noop,
    each,
    values,
    warning
}

export default {
    warning,
    extend,
    isFunction,
    isString,
    isRegExp,
    isDate,
    isBoolean,
    isArray,
    isNumber,
    find,
    unique,
    noop,
    each,
    values,
    isObject,
    FREEZE_OBJ,
    FREEZE_ARR,
    flatten,
    flattenFields,
    push,
    resolveKey,
    slice,
    inherits,
    returnFirst,
    result,
    path,
    toArray,
    xtend,
    clone,
    debounce,
    nullCheck,
    emptyCheck,
    uppercase,
    titlelize,
    applyFuncs,
    nextFunc
}
