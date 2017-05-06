var path = require('path');

function _resolve(value) {
    try {
        return require.resolve(value);
    } catch (e) {
        return require.resolve(path.join(process.cwd(), 'node_modules', value));
    }
}


module.exports = function process(conf = require('./babelrc.json'), resolve = _resolve, coverage) {

    function fix(prefix) {
        return function (v) {
            if (Array.isArray(v)) {
                if (v[0].startsWith('/')) return v;
                v[0] = resolve(`${prefix}-${v[0]}`);
                return v;
            }
            if (v.startsWith('/')) return v;
            return resolve(`${prefix}-${v}`);
        }
    }

    if (!conf.plugins) conf.plugins = [];
    if (!conf.presets) conf.presets = [];
//only needs to be set when using mocha,
    if (coverage) {
        conf.plugins.push([
            "istanbul",
            {
                "exclude": [
                    "**/test/*-test.js"
                ]
            }
        ]);
    }
    conf.plugins = conf.plugins.filter(Boolean).map(fix(`babel-plugin`));
    conf.presets = conf.presets.filter(Boolean).map(fix(`babel-preset`));
    return conf;
};