var webpack = require('./webpack.config.js'), path = require('path'), join = path.join.bind(path, __dirname);

module.exports = function (config) {
    config.set({
        browserNoActivityTimeout: 20000,
        browsers: ['Chrome'], //run in Chrome
        singleRun: true, //just run once by default
        frameworks: ['mocha'], //use the mocha test framework
        files: [
            'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.17.0/babel.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.12.0/codemirror.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.12.0/mode/javascript/javascript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.12.0/mode/xml/xml.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.12.0/mode/jsx/jsx.min.js',
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
        webpack: webpack,
        webpackMiddleware: {
            stats: {
                colors: true
            }
        }
    });

};
