var path = require('path');
module.exports =  function (options, webpack)  {
    webpack.module.rules.push({
        test: /\.tmpl$/,
        use: path.resolve(__dirname, 'tmpl-loader'),
        include: [
            path.resolve(__dirname, 'src')
        ]
    });

    if (options.isKarma || options.target === 'browser') {
        webpack.resolve.alias['babel-core'] = 'babel-standalone';
    }
    return webpack;
};
