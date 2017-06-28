// Karma configuration
var webpack                = require('./webpack.config');
var path                   = require('path');
const test                 = path.resolve(
    process.env.SUBSCHEMA_TEST_DIR || __dirname, 'test-index.js');
webpack.resolve.alias.test = path.resolve(process.cwd(), 'test');
webpack.devtool            = '#inline-source-map';
if (!webpack.output) {
    webpack.output = {};
}
webpack.output.pathinfo = true;
var useCoverage         = false;
if (process.env.SUBSCHEMA_COVERAGE) {
    console.warn(`enabling code coverage for karma`);
    useCoverage = true;
}
webpack.resolve.mainFields = ['source', 'main'];
console.warn('running tests in ', webpack.resolve.alias.test);
module.exports = function (config) {
    const karmaConf = {

        // base path, that will be used to resolve files and exclude
        basePath: path.resolve(process.cwd()),


        // frameworks to use
        frameworks: ['mocha'],


        // list of files / patterns to load in the browser
        files          : [
            test
        ],
        customLaunchers: {
            Chrome_with_debugging: {
                base         : 'Chrome',
                chromeDataDir: path.resolve(process.cwd(), '..', '.chrome')
            },
            Chrome_travis_ci     : {
                base : 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        // list of preprocessors
        preprocessors: {
            [test]: ['webpack']
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


        // enable / disable watching file and executing tests whenever any file
        // changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install
        // karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install
        // karma-safari-launcher`) - PhantomJS - IE (only Windows; has to be
        // installed with `npm install karma-ie-launcher`)
        browsers: ['Chrome'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // List plugins explicitly, since autoloading karma-webpack
        // won't work here
        plugins: [
            require('karma-mocha'),
            require('karma-chrome-launcher'),
            require('karma-firefox-launcher'),
            require('karma-spec-reporter'),
            require('karma-sourcemap-loader'),
            require('karma-webpack')
        ]
    };
    if (useCoverage) {
        karmaConf.reporters.push('coverage-istanbul');
        karmaConf.plugins.push('karma-coverage-istanbul-reporter');
        karmaConf.coverageIstanbulReporter = {
            // reports can be any that are listed here:
            // https://github.com/istanbuljs/istanbul-reports/tree/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib
            reports              : ['lcov', 'json'],
            // base output directory. If you include %browser% in the path it
            // will be replaced with the karma browser name
            dir                  : process.env.SUBSCHEMA_COVERAGE_DIR
                                   || path.join(process.cwd(), 'coverage'),
            fixWebpackSourcePaths: true
        };
        webpack.module.rules.unshift(
            {
                test   : /\.jsx?$/,
                // instrument only testing sources with Istanbul
                include: [/subschema*/, path.join(process.cwd(),
                    'src'), path.join(process.cwd(), 'public')],
                use    : 'istanbul-instrumenter-loader'
            }
        );
    }
    if (process.env.TRAVIS) {
        karmaConf.browsers = ['Firefox'];
    }
    if (process.env.SUBSCHEMA_DEBUG) {
        console.warn('karma-webpack %o', webpack);
    }
    config.set(karmaConf);
};
