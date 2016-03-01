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
            Object.keys(cobj).forEach(function (skey) {
                ['Enter', 'Leave', 'Appear'].reduce(function (obj, k) {
                    const lkey = k.toLowerCase();
                    const nobj = obj.transitionName || (obj.transitionName = {});
                    if (Style[`${skey}${k}`]) {
                        nobj[lkey] = Style[`${skey}${k}`];
                        nobj[`${lkey}Active`] = Style[`${skey}${k}Active`];
                    }
                    return obj;
                }, cobj[skey])[`transitionHeightClass`] = Style[`${skey}Height`]

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
