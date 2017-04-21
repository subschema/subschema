#!/usr/bin/env node
var path = require('path');
var camelCased = function (str) {
    return str.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    })
};
var cwd = process.cwd();

if (process.argv.indexOf('--config') == -1) {
    process.argv.push('--config', path.resolve(__dirname, '..', 'webpack.config.js'));
}
if (process.argv.indexOf('--entry') == -1) {
    process.argv.push('--entry', path.resolve(cwd, 'src', 'index.js'));
}
if (process.argv.indexOf('--output-path') == -1) {
    process.argv.push('--output-path', path.resolve(cwd, 'lib'))
}
if (process.argv.indexOf('--output-filename') == -1) {
    process.argv.push('--output-filename', path.join('index.js'));
}
if (process.argv.indexOf('--output-library') == -1) {
    process.argv.push('--output-library', camelCased(require(path.resolve(cwd, 'package.json')).name));
}

if (process.argv.indexOf('--output-library-target') == -1) {
    process.argv.push('--output-library-target', 'umd');
}
var idx;
if ((idx = process.argv.indexOf('--no-style-loader')) != -1) {
    console.log(`disabling style loader`);
    process.env.SUBSCHEMA_NO_STYLE_LOADER = 1;
    process.argv.splice(idx, 1);
}
if ((idx = process.argv.indexOf('--use-stats-file')) != -1) {
    var statsFile = process.argv.splice(idx, 2).pop();
    console.log(`outputing stats file '${statsFile}'`);
    process.env.SUBSCHEMA_USE_STATS_FILE = statsFile;
}
if ((idx = process.argv.indexOf('--use-externals')) != -1) {
    var externals = process.argv.splice(idx, 2).pop();
    console.log(`using externals ${externals}`);
    process.env.SUBSCHEMA_USE_EXTERNALS = externals;
}
require(path.resolve(__dirname, '..', 'node_modules', '.bin', 'webpack'));
