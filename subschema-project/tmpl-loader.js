"use strict";

var template = require('lodash/template');

var options = {
    interpolate: /@([\s\S]+?)@/g,
    escape: /@-([\s\S]+?)@/g,
    variable: '__REPLACE__'
};

module.exports = function (content) {
    this && this.cacheable && this.cacheable();
    var tmpl;
    try {
        tmpl = template(content, options);
    } catch (e) {
        console.error(e, content);
        throw e;
    }
    let source = tmpl.source.replace(/^function\(__REPLACE__\)/, 'function({jsName, scripts, project, pkg, sample,demo, title, description})');
    //fixing the result to not violate use strict and not break things
    return `var _ = { escape: function (value) {        return JSON.stringify(value, null, 2);} }; 
    module.exports =  ${source};`;
};