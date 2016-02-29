"use strict";
var styleCtx = require.context('.', false, /^.*-style\.js$/);
var lessCtx = require.context('.', false, /^.*\.(less|css)$/);

/**
 * This loads the style.js and then the less/css files merging
 * the styles from the css if they exist.
 */
module.exports = lessCtx.keys().reduce(function (obj, key) {
        var nkey = key.replace(/^\.\/(.*)\.(less|css)$/, '$1');
        var cobj = obj[nkey];
        var Style = lessCtx(key);
        if (cobj) {
            Object.keys(Style).forEach(function (skey) {
                if (cobj[skey]) {
                    cobj[skey] += ' ' + Style[skey];
                } else {
                    cobj[skey] = Style[skey];
                }
            });
        } else {
            obj[nkey] = Style;
        }
        return obj;
    },
    //First find the style.js.
    styleCtx.keys().reduce(function (obj, key) {
        obj[key.replace(/^\.\/(.*)-style\.js$/, '$1')] = styleCtx(key);
        return obj;
    }, {}));
