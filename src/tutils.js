"use strict";
var api = {
    template: require('lodash/string/template'),
    extend: require('lodash/object/extend'),
    isFunction: require('lodash/lang/isFunction'),
    isString: require('lodash/lang/isString'),
    isRegExp: require('lodash/lang/isRegExp'),
    isDate: require('lodash/lang/isDate'),
    isBoolean: require('lodash/lang/isBoolean'),
    isArray: require('lodash/lang/isArray'),
    isNumber:require('lodash/lang/isNumber'),
    find: require('lodash/collection/find'),
    unique: function (array) {
        return array.filter(function (a, b, c) {
            // keeps first occurrence
            return c.indexOf(a) === b;
        });
    },
    values: function (obj) {
        return obj == null ? [] : this.isArray(obj) ? obj : Object.keys(obj).map(function (v, i) {
            return obj[v];
        });
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
        if (Array.isArray(v)) {
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
        var tt = typeof t;
        if (t == null || tt === 'number' || tt === 'string' || tt === 'function') {
            return t;
        }
        if (t instanceof Date) {
            return new Date(t.getTime());
        }
        if (Array.isArray(t)) {
            return t.slice(0);
        }
        var ret = {};
        Object.keys(t).forEach(function (v) {
            ret[v] = t[v];
        });
        return ret;
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
    }
}
module.exports = api;