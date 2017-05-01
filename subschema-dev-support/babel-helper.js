var path = require('path');
var fs = require('fs');
var cwd = path.resolve.bind(path, process.cwd());
var conf;
if (fs.existsSync(cwd('.babelrc'))) {
    conf = require(cwd('.babelrc'));
} else {
    conf = require('./babelrc.json');
}

function fix(prefix) {
    return function (v) {
        if (Array.isArray(v)) {
            v[0] = require.resolve(`${prefix}-${v[0]}`);
            return v;
        }
        return require.resolve(`${prefix}-${v}`);
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
module.exports = conf;