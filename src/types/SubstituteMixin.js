"use strict";

import escape from 'lodash/string/escape';
import loget from 'lodash/object/get';
import defaults from 'lodash/object/defaults';
import isObject from 'lodash/lang/isObject';

function escapeGet(obj, key) {
    return escape(loget(obj, key, ''));
}

export default function substitute(str) {

    if (str == null) {
        str = '';
    }
    var checks = {};

    function substitute$inner(v, key) {
        checks[key] = true;
        return "'+(escapeGet(obj, '" + key + "'))+'";
    }

    str = str.replace(/'/g, "\\'");
    var format = new Function('escapeGet', 'obj', "obj = obj || {}; return \'" + (str.replace(/\{([^\{\}]*)\}/g, substitute$inner)) + "'").bind(null, escapeGet);
    var listen = Object.keys(checks);
    return {
        format,
        listen
    };
}

