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
    console.warn('no tests for project ', process.cwd());
    process.exit(0);
}

console.warn(`running tests in ${process.cwd()}`);
process.argv.push('--timeout', '20000');
process.argv.push('--compilers', 'js:' + path.resolve(__dirname, '..', 'babel-register'));
//process.argv.push('--require', path.resolve(__dirname, '..', 'babel-register'));
process.argv.push('test/**-test.js');
let mocha = `${__dirname}/../node_modules/mocha/bin/_mocha`;

let idx;
if ((idx = process.argv.indexOf('--no-fix-paths')) != -1) {
    process.argv.splice(idx, 1);
    process.env.SUBSCHEMA_NO_PATH_FIX = 1;
}
if (process.env.SUBSCHEMA_COVERAGE || process.env.SUBSCHEMA_COVERAGE_DIR || process.env.SUBSCHEMA_COVERAGE_USE_GLOBAL) {
    process.env.SUBSCHEMA_COVERAGE = 1;
    var coverage = process.env.SUBSCHEMA_COVERAGE_DIR || path.resolve(process.cwd(), 'coverage');
    if (process.env.SUBSCHEMA_COVERAGE_USE_GLOBAL) {
        coverage = path.resolve(process.cwd(), '..', 'coverage', path.basename(process.cwd()))
    }
    process.env.SUBSCHEMA_COVERAGE_LOAD_PLUGIN = 1;

    process.argv.splice(2, 0, '--source-map=false', `--report-dir=${coverage}`, `--reporter=json`, `--instrument=false`, '--all', '--include=src/**/*.js', mocha);
    mocha = path.resolve(__dirname, '..', 'node_modules', '.bin', 'nyc');
} else {
    process.argv.splice(2, 0, '-r', 'babel-polyfill');
}


require(mocha);