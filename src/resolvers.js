"use strict";
var ctx = require.context('./resolvers', false, /(?!.*index.js$)\.jsx?$/);
module.exports = ctx.keys().reduce(function (ret, key) {
    var imp = ctx(key);
    ret[key.replace(/.*\/(.*)\.jsx?$/, '$1')] = Object.keys(imp).reduce(function (o, k) {
        o[k] = imp[k];
        return o;
    }, imp.default);
    return ret;
}, {});