#!/usr/bin/env node
var path = require('path');
var camelCased = function (str) {
    return str.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    })
};
var cwd = process.cwd();
function indexOfArg() {
    var argv = process.argv.slice(2);
    var idx = -1;
    for (var i = 0, l = arguments.length; i < l; i++) {
        if ((idx = argv.indexOf(arguments[i])) != -1) {
            return idx + 2;
        }
    }
    return -1;
}

function hasArg() {
    return indexOfArg.apply(null, arguments) != -1;
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
    if (!hasArg('--output-filename')) {
        process.argv.push('--output-filename', '[hash].app.js');
    }
    let docs = path.resolve(process.cwd(), process.argv[idx + 1]);
    if (!hasArg('--output-path')) {
        process.argv.push('--output-path', docs);
    } else {
        docs = process.argv[process.argv.indexOf('--output-path') + 1];
    }
    process.argv.splice(idx, 2);
    console.warn(`docs will be in ${docs}`);


} else {


    if ((idx = indexOfArg('--externalize-peers')) != -1) {
        process.argv.splice(idx, 1);
        process.env.SUBSCHEMA_EXTERNALIZE_PEERS = 1;
    }

    if ((idx = indexOfArg('--no-externalize-peers')) != -1) {
        process.argv.splice(idx, 1);
    } else {
        //By default we externalize peer dependencies.
        process.env.SUBSCHEMA_EXTERNALIZE_PEERS = 1;
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
    if (!hasArg('--output-library-target')) {
        process.argv.push('--output-library-target', 'umd');
    }

    if ((idx = process.argv.indexOf('--no-style-loader')) != -1) {
        console.warn(`disabling style loader`);
        process.env.SUBSCHEMA_NO_STYLE_LOADER = 1;
        process.argv.splice(idx, 1);
    }
    if ((idx = process.argv.indexOf('--use-stats-file')) != -1) {
        var statsFile = process.argv.splice(idx, 2).pop();
        console.warn(`outputing stats file '${statsFile}'`);
        process.env.SUBSCHEMA_USE_STATS_FILE = statsFile;
    }
    if ((idx = process.argv.indexOf('--use-externals')) != -1) {
        var externals = process.argv.splice(idx, 2).pop();
        console.warn(`using externals ${externals}`);
        process.env.SUBSCHEMA_USE_EXTERNALS = externals;
    }
}
if (hasArg('--help', '-h')) {
    console.warn(`
ARGS: ${process.argv.slice(2)}    
subschema-webpack extensions
    --demo [path]\t\tgenerate a demo app a that location
    --no-style-loader\t\tdon't use style loader (better for server side).
    --use-stats-file [file]\toutput a file with css and compiled information.
    --use-externals [externals]\tuse the following as externals react,...
    --externalize-peers\t\t (default) use this to make externalize the peerDependencies.
    --no-externalize-peers Do not externalize peer dependencies.
    --debug\t\t\toutput some debug information.
    
    
Otherwise supports webpack commands:    
`)
}
require(path.resolve(__dirname, '..', 'node_modules', '.bin', 'webpack'));
