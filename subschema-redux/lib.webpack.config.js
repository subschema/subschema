"use strict";
var config = require('./internal.webpack.config');
//filename, externals, isNode, isMinify
module.exports = config('subschema-lib.js', true, true, false);