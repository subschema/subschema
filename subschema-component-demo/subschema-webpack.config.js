var path = require('path');
var join = path.join.bind(path, __dirname);
module.exports =  function (options, webpack)  {
    webpack.module.rules.push(
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
            use: options.useStyle('css-loader', options.useLess, options.usePostCss)
        });

    if (!webpack.externals.react) {
        webpack.resolve.alias.react = join('node_modules', 'react');
        webpack.resolve.alias['react-dom'] = join('node_modules', 'react-dom');
        webpack.resolve.alias['prop-types'] = join('node_modules', 'prop-types');
    }
    return webpack;
};
