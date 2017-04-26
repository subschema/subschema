var path = require('path');
var fs = require('fs');
var cwd = path.resolve.bind(path, process.cwd());
var mod = path.resolve.bind(path, __dirname);
var conf;
var modname;
if (fs.existsSync(cwd('.babelrc'))) {
    conf = require(cwd('.babelrc'));
    modname = require.resolve;
} else {
    conf = require('./babelrc.json');
    modname = path.resolve.bind(path, mod('node_modules'));
}

function fix(prefix) {
    return function (v) {
        if (Array.isArray(v)) {
            v[0] = modname(`${prefix}-${v[0]}`);
            return v;
        }
        return modname(`${prefix}-${v}`);
    }
}
//only needs to be set when using mocha,
if (process.env.SUBSCHEMA_COVERAGE_LOAD_PLUGIN) {
    conf.plugins.push([
        "istanbul",
        {
            "exclude": [
                "**/test/*-test.js"
            ]
        }
    ]);
}
conf.plugins = conf.plugins.map(fix(`babel-plugin`));
conf.presets = conf.presets.map(fix(`babel-preset`));
console.log('babel', JSON.stringify(conf, null, 2));
module.exports = conf;