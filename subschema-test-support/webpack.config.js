"use strict";

var path = require('path'), join = path.join.bind(path, __dirname);

module.exports = {
    output: {
        path: join('.', 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'SubschemaTestSamples'

    },
    externals: {
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
    },
    entry: {
        index: join('samples.js')
    },
    module: {
        extensions: ['', '.js', '.jsx'],

        loaders: [

            {
                test: /\.jsx?$/,
                loader: 'babel'
            }
        ]
    }

};