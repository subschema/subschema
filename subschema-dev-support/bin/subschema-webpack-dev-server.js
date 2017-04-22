#!/usr/bin/env node
var path = require('path');
var cwd = process.cwd();

if (process.argv.indexOf('--config') == -1) {
    process.argv.push('--config', path.resolve(__dirname, '..', 'webpack.config.js'));
}
if (process.argv.indexOf('--entry') == -1) {
    process.argv.push('--entry', path.resolve(cwd, 'public', 'index.jsx'));
}
if (process.argv.indexOf('--output-path') == -1) {
    process.argv.push('--output-path', path.resolve(cwd, 'lib'))
}
if (process.argv.indexOf('--output-filename') == -1) {
    process.argv.push('--output-filename', path.join('app.entry.js'));
}


if ((idx = process.argv.indexOf('--use-externals')) != -1) {
    var externals = process.argv.splice(idx, 2).pop();
    console.log(`using externals ${externals}`);
    process.env.SUBSCHEMA_USE_EXTERNALS = externals;
}
process.env.SUBSCHEMA_USE_HTML = 1;
require(path.resolve(__dirname, '..', 'node_modules', '.bin', 'webpack-dev-server'));
