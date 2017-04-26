"use strict";

var fs = require('fs');
var conf = require('./babel-helper');
var Module = require('module');
var path = require('path');
var babelRegister = require('babel-register');
var oload = Module._load;
var project = path.join(__dirname, '..');
//only look into ern- projects that have a src directory.
conf.only = /subschema[^/]*\/(src|test|lib)/;
var cwd = process.cwd();

Module._load = function (file, parent) {

    var isRelative = file.startsWith('.');

    var fullpath = isRelative ? path.resolve(path.dirname(parent.filename), file).replace(project, '') : file.startsWith('/') ? file.replace(project, '') : file;
    if (isRelative && /subschema(?:[a-z-]*)(\/lib\/(.*))$/.test(fullpath)) {
        const pp = /^\/?(subschema(?:[a-z-]*))(?:\/lib\/)(.+?)$/.exec(fullpath);
        // console.log(cwd, fullpath, pp);
        if (pp) {
            return oload(path.join(cwd, '..', pp[1], 'src', pp[2] || 'index.js'));
        }
    }
    var parts = /^(subschema(?:[a-z-]*))(?:\/node_modules\/(subschema(?:[a-z-]*)))*(?:\/(?:src|lib)(?:\/?(.+?)?))?$/.exec(fullpath);
    if (parts) {
        var pkg = parts[1];
        var fpkg = parts[2];
        var file = parts[3] || 'index.js';
        var rp = path.join(project, fpkg || pkg, 'src', file);
        return oload(rp, parent);
    }
    return oload(file, parent);
};

babelRegister(conf);

