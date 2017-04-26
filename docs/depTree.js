#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var cwd = process.cwd();
var push = Function.apply.bind(Array.prototype.push)
var deps = fs.readdirSync(cwd).reduce(function (obj, dir) {
    if (/subschema/.test(dir)) {
        obj[dir] = require(path.join(cwd, dir, 'package.json'));
    }
    return obj;
}, {});

function filter(pattern) {
    return Array.prototype.slice.call(arguments, 1).reduce(function (arr, dep) {
        push(arr, Object.keys(dep).filter(v=>pattern.test(v)));
        return arr;
    }, []);

}
var ret = Object.keys(deps).reduce(function (obj, k) {
    return filter(/subschema/, deps[k].devDependencies || {}, deps[k].dependencies || {}).reduce(function (o, d) {
        if (o[d]) {
            o[d].push(k);
        } else {
            o[d] = [k];
        }
        return o;
    }, obj);
}, {});

console.log(ret);