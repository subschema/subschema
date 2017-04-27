"use strict";

var template = require('lodash/template');

var options = {
    interpolate: /@([\s\S]+?)@/g,
    escape: /@-([\s\S]+?)@/g
};

module.exports = function (content) {
    this.cacheable && this.cacheable();
    var tmpl;
    try {
        tmpl = template(content, options);
    } catch (e) {
        console.error(e, content);
        throw e;
    }
    return 'var _ = { escape: function (value) {        return JSON.stringify(value, null, 2);} }; module.exports = ' + tmpl.source + ';';
};