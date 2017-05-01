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
    console.warn('no tests for project', require(path.resolve(process.cwd(), 'package.json')).name);
    process.exit(0);
}
function indexOfArg() {
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
if ((pos = indexOfArg('start', 'init', 'run', 'completion')) == -1) {
    process.argv.splice(2, 0, 'start', conf);
} else {
    process.argv.splice(pos - 1, 0, conf);
}
//only do single run if test event cycle or prepublish.
if (process.env.npm_lifecycle_event === 'test' || process.env.npm_lifecycle_event === 'prepublish') {
    if (indexOfArg('--single-run') == -1)
        process.argv.push('--single-run');
}
if (process.env.SUBSCHEMA_COVERAGE || process.env.SUBSCHEMA_COVERAGE_DIR || process.env.SUBSCHEMA_COVERAGE_USE_GLOBAL) {
    process.env.SUBSCHEMA_COVERAGE = 1;
    if (indexOfArg('--single-run') == -1) {
        process.argv.push('--single-run');
    }
    if (process.env.SUBSCHEMA_COVERAGE_USE_GLOBAL) {
        process.env.SUBSCHEMA_COVERAGE_DIR = path.resolve(process.cwd(), '..', 'coverage', path.basename(process.cwd()))
    }
}

if (indexOfArg('--single-run') != -1 && indexOfArg('--browser') == -1) {
    process.argv.push('--browser', 'Firefox');
}
//use these aliases by default, when running in karma. This ensures the same version of react, react-dom are used
//for all tests, regardless of imports.
process.env.SUBSCHEMA_USE_ALIASES = 'react,react-dom';

require(path.resolve(__dirname, '..', 'node_modules', '.bin', 'karma'));
