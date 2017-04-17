"use strict";

import escape from "lodash/escape";
import loget from "lodash/get";

function escapeGet(obj, key) {
    return escape(loget(obj, key, ''));
}

function isQuoted(v) {
    if (!v) return false;

    const first = v[0], last = v[v.length - 1];
    if (first === '"' && last === '"' || first === "'" && last === "'") {
        return true;
    }
    return false;
}
function requote(v) {
    return JSON.stringify(v.substring(1, v.length - 1));
}
function addArg(obj, key) {
    if (!isQuoted(key)) {
        obj[key] = true;
    }
    return obj;
}

function toArg(v) {
    return isQuoted(v) ? requote(v) : `loget(obj, ${JSON.stringify(v)})`;
}
function maybeEscape(v) {
    const parts = /^--(.*?)--$/.exec(v);
    if (parts) {
        return parts[1];
    }
    return escape(v);
}

const reexpr = /\{([^\\}]*(?:\\.[^\\}]*)*)\}|$/g;

export default function substitute(str) {

    if (str == null) {
        str = '';
    }
    const checks = {};
    const funcs = {};

    let source = "obj = obj || {}; return ";
    let prevIdx = 0;

    function substitute$inner(match, key, offset) {

        source += `${JSON.stringify(str.substring(prevIdx, offset))}+`;
        if (key) {
            prevIdx = (offset + match.length);
        }
        const f = /\s*(\w+?)\s*\(\s*([^)]+?)\s*\)/.exec(key);
        if (f) {
            funcs[f[1]] = true;
            const args = f[2].split(/\,\s*/);
            args.reduce(addArg, checks);
            key = `$fns.${f[1]}(${(args.map(toArg).join(', '))})`;

            source += `(maybeEscape(${key}))+`;

        } else if (key) {
            checks[key] = true;
            source += `(escapeGet(obj, ${JSON.stringify(key)}))+`;
        }
    }

    str.replace(reexpr, substitute$inner);

    source += '""';
    const format = new Function('escapeGet', 'loget', 'escape', 'maybeEscape', 'obj', '$fns', source).bind(null, escapeGet, loget, escape, maybeEscape);
    const listen = Object.keys(checks);
    const formatters = Object.keys(funcs);
    return {
        format,
        listen,
        formatters
    };
}

