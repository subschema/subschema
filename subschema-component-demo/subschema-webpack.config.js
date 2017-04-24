var path = require('path');
var join = path.join.bind(path, __dirname);
module.exports = function (config, opts) {
    config.module.rules.push(
        {
            test: /\.md$/,
            include: [
                join('public/develop')
            ],
            use: {
                loader: '!!raw-loader!'
            }
        },
        {
            test: /\.lessp$/,
            use: opts.useStyle('css-loader', opts.useLess, opts.usePostCss)
        });

    config.resolve.alias['subschema-source'] = join('node_modules', 'subschema');

    Object.assign(config.externals, {
        'babel-standalone-internal': {
            'var': 'Babel',
            'commonjs': 'babel',
            'commonjs2': 'babel'
        }/*,
        'codemirror': {
            'var': 'CodeMirror',
            'commonjs': 'codemirror',
            'commonjs2': 'codemirror'
        }*/
    });
    return config;
};
