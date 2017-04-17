"use strict";
var config = require('./internal.webpack.config');

//config(filename, externals, isNode, isMinify)
var configs = [
    config('subschema-server.js', true, true, false),
    config('subschema.js', false, false, true),
    config('subschema-noreact.js', true, false, true)

];
module.exports = configs;