var webpackConfig = require('./webpack.config.js'), webpack = require('webpack'), path = require('path'),
    join = path.join.bind(path, __dirname);


if (!webpackConfig.plugins) {
    webpackConfig.plugins = [];
}
delete webpackConfig.entry;

webpackConfig.plugins.unshift(new webpack.DefinePlugin({'process.env.NODE_ENV': '"development"'}));

webpackConfig.devtool = '#inline-sourcemap';
webpackConfig.resolve.alias['subschema-server-utils'] = join('src');

delete webpackConfig.target;

module.exports = function (config) {
    config.set({
        browserNoActivityTimeout: 20000,
        browsers: ['Chrome'], //run in Chrome
        singleRun: true, //just run once by default
        frameworks: ['mocha'], //use the mocha test framework
        files: [
            'test/index.js', //just load this file,
            {
                pattern: '**/*.js.map',
                included: false
            }
        ],
        preprocessors: {
            'test/*': ['webpack', 'sourcemap'] //preprocess with webpack and our sourcemap loader
        },
        reporters: ['dots'], //report results in this format
        webpack: webpackConfig,
        webpackMiddleware: {
            stats: {
                colors: true
            }
        }
    });

};
