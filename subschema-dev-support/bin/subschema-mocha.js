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
    console.log('no tests for project ', process.cwd());
    process.exit(0);
}

console.log(`running tests in ${process.cwd()}`);
process.argv.push('--timeout', '20000');
process.argv.push('--compilers', 'js:' + path.resolve(__dirname, '..', 'babel-register'));
//process.argv.push('--require', path.resolve(__dirname, '..', 'babel-register'));
process.argv.push('test/**-test.js');
let mocha = `${__dirname}/../node_modules/mocha/bin/_mocha`;

if (process.env.SUBSCHEMA_COVERAGE || process.env.SUBSCHEMA_COVERAGE_DIR || process.env.SUBSCHEMA_COVERAGE_USE_GLOBAL) {
    process.env.SUBSCHEMA_COVERAGE = 1;
    var coverage = process.env.SUBSCHEMA_COVERAGE_DIR || path.resolve(process.cwd(), 'coverage');
    if (process.env.SUBSCHEMA_COVERAGE_USE_GLOBAL) {
        coverage = path.resolve(process.cwd(), '..', 'coverage', path.basename(process.cwd()))
    }
    process.env.SUBSCHEMA_COVERAGE_LOAD_PLUGIN=1;

    process.argv.splice(2, 0, '--source-map=false', `--report-dir=${coverage}`, `--reporter=json`, `--instrument=false`, '--all', '--include=src/**/*.js',  mocha);
    mocha = path.resolve(__dirname, '..', 'node_modules', '.bin', 'nyc');
}

console.log(mocha, process.argv.slice(2).join(' '));
require(mocha);