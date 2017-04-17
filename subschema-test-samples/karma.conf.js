var webpackConfig = require('./webpack.config.js'), webpack = require('webpack');
var path = require('path');

if (!webpackConfig.plugins) {
    webpackConfig.plugins = [];
}
webpackConfig.plugins.unshift(new webpack.DefinePlugin({'process.env.NODE_ENV': '"development"'}));
webpackConfig.output.pathinfo = true;
webpackConfig.externals = {
    'Subschema': {
        root: 'Subschema'
    },
    'subschema': {
        root: 'Subschema'
    },
    'react': {
        root: 'React'
    },
    'react-dom': {
        root: 'ReactDOM'
    }
};
var resolve = webpackConfig.resolve || (webpackConfig.resolve = {});
var alias = resolve.alias || (resolve.alias = {});
alias["subschema-test-samples"] = path.join(__dirname, 'samples.js');
alias["react-addons-test-utils"] = path.join(__dirname, 'react-addons-test-utils.shim.js');
webpackConfig.entry = './test/index';

module.exports = function (config) {
    config.set({
        browserNoActivityTimeout: 20000,
        browsers: ['Chrome'], //run in Chrome
        singleRun: true, //just run once by default
        frameworks: ['mocha'], //use the mocha test framework
        files: [
            'node_modules/react/dist/react-with-addons.js',
            'node_modules/react-dom/dist/react-dom.js',
            'node_modules/subschema/dist/subschema-noreact.js',
            'test/index.js', //just load this file,
            {
                pattern: '**/*.js.map',
                included: false
            },
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
