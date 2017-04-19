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
require(path.resolve(__dirname, '..', 'node_modules', '.bin', 'webpack'));
