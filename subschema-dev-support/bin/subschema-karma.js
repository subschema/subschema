#!/usr/bin/env node
var path = require('path');
function hasArg() {
    var args = process.argv.slice(2);
    for (var i = 0, l = arguments.length; i < l; i++) {
        var idx = args.indexOf(arguments[i]);
        if (idx != -1)
            return idx;
    }
    return -1;
}
var conf = path.resolve(__dirname, '..', 'karma.conf.js');
var pos;
if ((pos = hasArg('start', 'init', 'run', 'completion')) == -1) {
    process.argv.splice(2, 0, 'start', conf);
} else {
    process.argv.splice(pos-1, 0, conf);
}
require(path.resolve(__dirname, '..', 'node_modules', '.bin', 'karma'));
