var path = require('path');
module.exports = function (webpack) {
    webpack.module.rules.push({
        test: /\.tmpl$/,
        use: path.resolve(__dirname, 'tmpl-loader'),
        include: [
            path.resolve(__dirname, 'src')
        ]
    });
    return webpack;
};
