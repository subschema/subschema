#!/usr/bin/env node
var path = require('path');
var conf = require('../babel-helper');
if (process.argv.indexOf('-s') == -1) {
    process.argv.push('-s', 'true');
}
if (process.argv.indexOf('--out-file') == -1 && process.argv.indexOf('--out-dir') == -1) {
    process.argv.push('--out-dir', 'lib');
}
if (process.argv.indexOf('--copy-files') == -1 && process.argv.indexOf('-D') == -1) {
    process.argv.push('--copy-files');
}
if (process.argv.indexOf('--presets') == -1) {
    process.argv.push('--presets', conf.presets);
}
if (process.argv.indexOf('--plugins') == -1) {
    process.argv.push('--plugins', conf.plugins);
}
if (process.argv.indexOf('--out-file') == -1 && process.argv.indexOf('--filename') == -1) {
    process.argv.push('src');
}
require(path.resolve(__dirname, '..', 'node_modules', '.bin', 'babel'));
