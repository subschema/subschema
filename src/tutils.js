"use strict";
var api = {
    FREEZE_OBJ: Object.freeze({}),
    FREEZE_ARR: Object.freeze([]),
    extend: require('lodash/object/extend'),
    isFunction: require('lodash/lang/isFunction'),
    isString: require('lodash/lang/isString'),
    isRegExp: require('lodash/lang/isRegExp'),
    isDate: require('lodash/lang/isDate'),
    isBoolean: require('lodash/lang/isBoolean'),
    isArray: require('lodash/lang/isArray'),
    isNumber: require('lodash/lang/isNumber'),
    find: require('lodash/collection/find'),
    unique: require('lodash/array/unique'),
    noop: require('lodash/utility/noop'),
    each: require('lodash/collection/each'),
    values: require('lodash/object/values'),
    returnFirst: function (value) {
        return value;
    },
    result: function result(scope, key) {
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
    },

    path: function () {
        var args = api.slice(arguments), l = args.length, i = 0, j = 0, p;
        var ret = '';
        for (; i < l; i++) {
            p = args[i];
            if (p == null || p === '') continue;
            ret += (j++ === 0) ? p : "." + p;
        }
        return ret;

    },
    flatten: Function.apply.bind(Array.prototype.concat, []),
    toArray: function (v) {
        if (api.isArray(v)) {
            return v;
        }
        if (api.isString(v)) {
            return v.split(/\,\s*/);
        }
        if (v == null) {
            return [];
        }
        return [v];
    },
    xtend: function (dest, args) {
        dest = dest || {};
        for (var i = 1, l = arguments.length; i < l; i++) {
            var arg = arguments[1];
            if (arg == null) continue;
            for (var j in arg) {
                dest[j] = args[j];
            }
        }
        return dest;
    },
    slice: Function.call.bind(Array.prototype.slice),
    clone: function (t) {
        if (t == null) return t;
        var tt = typeof t;
        if (tt == 'boolean' || tt === 'number' || tt === 'string' || tt === 'function' || tt === 'symbol') {
            return t;
        }
        if (api.isArray(t)) {
            return t.concat();
        }
        if (t instanceof Date) {
            return new Date(t.getTime());
        }
        return api.extend({}, t);
    },
    debounce: function (fn, to) {
        var ti;

        return function f() {
            clearTimeout(ti);
            var args = Array.prototype.slice.call(arguments), self = this;
            ti = setTimeout(function () {
                fn.apply(self, args);
            }, to);
        }
    },
    nullCheck: function (v) {
        return v != null;
    },
    emptyCheck: function (v) {
        return v != null && v.length > 0;
    },
    uppercase: function (v) {
        return v.toUpperCase();
    },
    titlelize: function (value) {
        return ((value || '') + '').replace(/([A-Z])/g, ' $1').replace(/^./, api.uppercase);
    },
    push: Function.apply.bind(Array.prototype.push),
    applyFuncs: function (f1, f2) {
        if (f1 && !f2) return f1;
        if (!f1 && f2) return f2;
        return function tutils$applyFuncs$wrapper() {
            f1.apply(this, arguments);
            f2.apply(this, arguments);
        }
    },
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
    nextFunc: function (f1, f2) {
        if (f1 && !f2) return f1;
        if (f2 && !f1) return f2;
        return function tutils$nextFunc$wrapper() {
            if (f1.apply(this, arguments) !== false) {
                return f2.apply(this, arguments);
            }
        }
    }

};
module.exports = api;