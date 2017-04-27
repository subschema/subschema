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
var idx;
if ((idx = process.argv.indexOf('--no-hot')) != -1) {
    var hidx = process.argv.indexOf('--hot');
    if (hidx > -1) {
        process.argv.splice(hidx, 1);
    }
} else {
    if (process.argv.indexOf('--hot') == -1) {
        process.argv.push('--hot');
    }
    process.env.SUBSCHEMA_USE_HOT = 1;
}

if ((idx = process.argv.indexOf('--use-externals')) != -1) {
    var externals = process.argv.splice(idx, 2).pop();
    console.warn(`using externals ${externals}`);
    process.env.SUBSCHEMA_USE_EXTERNALS = externals;
}
if (process.argv.indexOf('-h') != -1 || process.argv.indexOf('--help') != -1) {
    console.warn(`${process.argv[1]}
    \t--use-externals a comma seperated dot valued list of externals to use`);
}
process.env.SUBSCHEMA_USE_HTML = 1;
require(path.resolve(__dirname, '..', 'node_modules', '.bin', 'webpack-dev-server'));
