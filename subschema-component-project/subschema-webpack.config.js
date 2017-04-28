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
    return config;
};
