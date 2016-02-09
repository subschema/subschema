"use strict";
var ctx = require.context('./resolvers', false, /(?!.*index.js$)\.jsx?$/);
module.exports = ctx.keys().reduce(function (ret, key) {
    ret[key.replace(/.*\/(.*)\.jsx?$/, '$1')] = ctx(key).default;
    return ret;
}, {});