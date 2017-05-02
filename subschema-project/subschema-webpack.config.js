var path = require('path');
module.exports = function (webpack, opts) {
    webpack.module.rules.push({
        test: /\.tmpl$/,
        use: path.resolve(__dirname, 'tmpl-loader'),
        include: [
            path.resolve(__dirname, 'src')
        ]
    });

    if (opts.isKarma || opts.target === 'browser') {
        webpack.resolve.alias['babel-core'] = 'babel-standalone';
    }
    return webpack;
};
