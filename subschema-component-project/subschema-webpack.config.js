var path = require('path');
var join = path.join.bind(path, __dirname);
module.exports = function (config) {
    config.module.rules.push(
        {
            test: /\.tmpl$/,
            use: join('tmpl-loader'),
            include: [
                join('src')
            ]
        },
        {
            test: /\.json$/,
            use: 'json-loader'
        });
    if (Array.isArray(config.externals)) {
        config.externals = config.externals.reduce(function (ret, key) {
            ret[key] = key;
            return ret;
        }, {})
    }
    if (!config.resolve.alias) config.resolve.alias = {};
    config.resolve.alias['subschema-source'] = join('node_modules', 'subschema');
    Object.assign(config.externals, {
        'babel-standalone-internal': {
            'var': 'Babel',
            'commonjs': 'babel',
            'commonjs2': 'babel'
        }
    });
    return config;
};
