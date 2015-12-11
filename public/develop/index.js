"use strict";
var ctx = require.context('.', false, /(?!(.*(index|-setup)\.jsx?$)).*\.jsx?$/);

module.exports = ctx.keys().reduce(function (obj, key) {
    if (/(index|-setup)/.test(key)) {
        return obj;
    }
    console.log('wtf?', key);
    obj[key.replace(/\.jsx?$/, '').replace(/.*\//, '')] = ctx(key);
    return obj;
}, {});

