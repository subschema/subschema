"use strict";
var context = require.context('.', false, /^(?!.*(index).js$).*\.js(x)?$/); //make sure you have your directory and regex test set correctly!
var api = {};
context.keys().forEach(function(key){
    api[key.replace(/^\.\/(.*)-style\.js$/, '$1')] = context(key);
});

module.exports = api;