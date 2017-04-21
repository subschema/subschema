var path = require('path');
var join = path.join.bind(path, __dirname);cd
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
    Object.assign(config.externals, {
        'babel-standalone-internal': {
            'var': 'Babel',
            'commonjs': 'babel',
            'commonjs2': 'babel'
        }
    });
    console.log('config', JSON.stringify(config, null, 2));
    return config;
};
