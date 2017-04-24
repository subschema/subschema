#!/usr/bin/env node
var path = require('path');
var camelCased = function (str) {
    return str.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    })
};
var cwd = process.cwd();
function hasArg() {
    for (var i = 0, l = arguments.length; i < l; i++) {
        if (process.argv.indexOf(arguments[i]) != -1) {
            return true;
        }
    }
    return false;
}
if (!hasArg('--config')) {
    process.argv.push('--config', path.resolve(__dirname, '..', 'webpack.config.js'));
}
if (!hasArg('--entry')) {
    process.argv.push('--entry', path.resolve(cwd, 'src', 'index.js'));
}
if (!hasArg('--output-path')) {
    process.argv.push('--output-path', path.resolve(cwd, 'lib'))
}
if (!hasArg('--output-filename')) {
    process.argv.push('--output-filename', path.join('index.js'));
}
if (!hasArg('--output-library')) {
    process.argv.push('--output-library', camelCased(require(path.resolve(cwd, 'package.json')).name));
}
if (hasArg('-p', '--production')) {
    process.env.NODE_ENV = 'production';
}
if (!hasArg('--output-library-target')) {
    process.argv.push('--output-library-target', 'umd');
}

var idx;


if ((idx = process.argv.indexOf('--demo')) != -1) {
    process.argv.splice(idx, 1);
    process.env.SUBSCHEMA_USE_NAME_HASH = 1;
    process.env.SUBSCHEMA_NO_STYLE_LOADER = 1;
    process.env.SUBSCHEMA_USE_HTML = 1;
    if (!hasArg('--devtool')) {
        process.argv.push('--devtool', 'sourcemap');
    }
    if (!hasArg('--entry')) {
        process.argv.push('--entry', './public/index.jsx');
    }
    if (!hasArg('--output-path')) {
        process.argv.push('--output-path', 'dist');
    }
} else {
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
}
require(path.resolve(__dirname, '..', 'node_modules', '.bin', 'webpack'));
