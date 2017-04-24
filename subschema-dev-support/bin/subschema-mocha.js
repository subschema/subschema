#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var test = path.join(process.cwd(), 'test')
if (!fs.existsSync(test) || fs.readdirSync(test).filter(function (t) {
        return /-test\.js/.test(t)
    }).length == 0) {

    console.log('no tests for project ', process.cwd());
    process.exit(0);
}

console.log(`running tests in ${process.cwd()}`);
process.argv.push('--timeout', '20000');
process.argv.push('--compilers', 'js:' + path.join(__dirname, '..', 'babel-register'));
process.argv.push('test/*-test.js');
require(`${__dirname}/../node_modules/mocha/bin/mocha`);