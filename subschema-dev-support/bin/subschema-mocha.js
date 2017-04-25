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
process.argv.push('--compilers', 'js:' + path.join(__dirname, '..', 'babel-register'));
process.argv.push('test/**-test.js');
require(`${__dirname}/../node_modules/mocha/bin/mocha`);