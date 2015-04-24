var webpack = require('webpack'), path = require('path');
;

module.exports = function (config) {
    config.set({
        browsers: ['Chrome'], //run in Chrome
        singleRun: true, //just run once by default
        frameworks: ['mocha'], //use the mocha test framework
        files: [
            './tests.webpack.js' //just load this file
        ],
        preprocessors: {
            './tests.webpack.js': ['webpack', 'sourcemap'] //preprocess with webpack and our sourcemap loader
        },
        reporters: ['dots'], //report results in this format
        webpack: { //kind of a copy of your webpack config
            cache: true,
            debug: true,
            devtool: 'inline-source-map',

            entry: {
                app: path.join(__dirname, 'test/support/entry.jsx')
            },

            stats: {
                colors: true,
                reasons: true
            },
            module: {
                loaders: [
                    {
                        test: /\.js(x)?$/,
                        exclude: [/node_modules/, /tests\.webpack\.js/],
                        loader: 'babel-loader?stage=0'
                    },
                    {test: /\.jsx?$/, loader: 'babel-loader?stage=0'},
                    {
                        test: /\.less$/,
                        loader: 'style!css!less-loader'
                    }
                ]
            },

            resolve: {
                alias: {
                    'react': path.join(__dirname, '/node_modules/react'),
                    'subschema$': path.join(__dirname, 'src/index.jsx')
                }
            },

            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify('development')
                })]

        }
    });

};
