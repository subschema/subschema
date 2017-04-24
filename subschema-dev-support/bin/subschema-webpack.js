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
var idx;
if (hasArg('-p', '--production')) {
    process.env.NODE_ENV = 'production';
}
if (!hasArg('--config')) {
    process.argv.push('--config', path.resolve(__dirname, '..', 'webpack.config.js'));
}

if ((idx = process.argv.indexOf('--demo')) != -1) {
    process.env.SUBSCHEMA_USE_NAME_HASH = 1;
    process.env.SUBSCHEMA_NO_STYLE_LOADER = 1;
    process.env.SUBSCHEMA_USE_HTML = 1;
    if (!hasArg('--devtool')) {
        process.argv.push('--devtool', 'sourcemap');
    }
    if (!hasArg('--entry')) {
        process.argv.push('--entry', './public/index.jsx');
    }
    if (!hasArg('--output-filename')){
        process.argv.push('--output-filename', '[hash].app.js');
    }
    let docs = path.resolve(process.cwd(), process.argv[idx + 1]);
    if (!hasArg('--output-path')) {
        process.argv.push('--output-path', docs);
    } else {
        docs = process.argv[process.argv.indexOf('--output-path') + 1];
    }
    process.argv.splice(idx, 2);
    console.log(`docs will be in ${docs}`, process.argv);


} else {


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
    if (!hasArg('--output-library-target')) {
        process.argv.push('--output-library-target', 'umd');
    }

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
if (hasArg('--help', '-h')){
    console.log(`
subschema-webpack extensions
    --demo [path]\t\tgenerate a demo app a that location
    --no-style-loader\t\tdon't use style loader (better for server side).
    --use-stats-file [file]\toutput a file with css and compiled information.
    --use-externals [externals]\tuse the following as externals react,...
    --debug\t\t\toutput some debug information.
    
Otherwise supports webpack commands:    
`)
}
require(path.resolve(__dirname, '..', 'node_modules', '.bin', 'webpack'));
