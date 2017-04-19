#!/usr/bin/env node
var path = require('path');
process.argv.push(path.resolve(__dirname, '..', 'karma.conf.js'));
require(path.resolve(__dirname, '..', 'node_modules', '.bin', 'karma'));
