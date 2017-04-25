#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
function check(file, parent) {
    var p = path.resolve(parent, file);
    if (!fs.existsSync(p)) {
        return false;
    }
    if (fs.lstatSync(p).isDirectory()) {
        var files = fs.readdirSync(p);
        for (var i = 0, l = files.length; i < l; i++) {
            if (check(files[i], p)) {
                return true;
            }
        }
    }
    return /-test\.jsx?$/.test(file)
}

if (!check('test', process.cwd())) {
    console.log('no tests for project', require(path.resolve(process.cwd(), 'package.json')).name);
    process.exit(0);
}
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
    process.argv.splice(pos - 1, 0, conf);
}
//only do single run if test event cycle.
if (process.env.npm_lifecycle_event === 'test') {
    if (hasArg('--single-run') == -1)
        process.argv.push('--single-run');
}

if (hasArg('--single-run') != -1 && hasArg('--browser') == -1) {
    process.argv.push('--browser', 'Firefox');
}

require(path.resolve(__dirname, '..', 'node_modules', '.bin', 'karma'));
