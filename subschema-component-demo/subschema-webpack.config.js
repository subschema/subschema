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

    if (!config.externals.react) {
        config.resolve.alias.react = join('node_modules', 'react');
        config.resolve.alias['react-dom'] = join('node_modules', 'react-dom');
        config.resolve.alias['prop-types'] = join('node_modules', 'prop-types');
    }
    return config;
};
