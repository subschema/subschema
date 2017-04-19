#!/usr/bin/env node
var path = require('path');
if (process.argv.length == 2) {
    process.argv.push('start');
}
process.argv.push(path.resolve(__dirname, '..', 'karma.conf.js'));
require(path.resolve(__dirname, '..', 'node_modules', '.bin', 'karma'));
