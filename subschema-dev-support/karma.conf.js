// Karma configuration
var webpack = require('./webpack.config');
var path = require('path');
const test = path.resolve(__dirname, 'test-index.js');
webpack.resolve.alias.test = path.resolve(process.cwd(), 'test');
webpack.devtool = '#inline-source-map';
if (!webpack.output) webpack.output = {};
webpack.output.pathinfo = true;

console.log('running tests in ', webpack.resolve.alias.test);
module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: path.resolve(process.cwd()),


        // frameworks to use
        frameworks: ['mocha'],


        // list of files / patterns to load in the browser
        files: [
            test
        ],
        customLaunchers: {
            Chrome_with_debugging: {
                base: 'Chrome',
                chromeDataDir: path.resolve(process.cwd(), '..', '.chrome')
            }
        },

        // list of preprocessors
        preprocessors: {
            [test]: ['webpack', 'sourcemap']
        },


        webpack,

        webpackMiddleware: {
            stats: {
                colors: true
            }
        },


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['spec'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        /**
         * level of logging
         *
         * possible values:
         * config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN
         * config.LOG_INFO    || config.LOG_DEBUG
         */
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['Chrome'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // List plugins explicitly, since autoloading karma-webpack
        // won't work here
        plugins: [
            require('karma-mocha'),
            require('karma-chrome-launcher'),
            require('karma-spec-reporter'),
            require('karma-sourcemap-loader'),
            require('karma-webpack')
        ]
    })
};