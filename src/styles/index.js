"use strict";
var context = require.context('.', false, /\.js$/); //make sure you have your directory and regex test set correctly!
var api = {};
context.keys().forEach(function(key){
    var k = key.replace(/^\.\/(.*)\.js$/, '$1');
    api[k] = context(key);
});

module.exports = api;