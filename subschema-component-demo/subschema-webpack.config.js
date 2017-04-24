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

    return config;
};
