var webpack = require('webpack'), defaults = require('lodash/object/defaults'), version = require('./package.json').version;
module.exports = defaults({
    devtool: null,
    entry: {
        'example-app':'./public/app.jsx',
        Subschema: './src/index.js'
    },
    output: {
        path: 'dist/',
        filename: '[name].'+version+'.js',
        chunkFilename: '[name].'+version+'.js',
        publicPath: '/',
        // export itself to a global var
        libraryTarget: "umd",
        // name of the global var: "Foo"
        library: "Subschema"

    },

    plugins: [
     //   new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.NoErrorsPlugin(),
        function () {
            this.plugin("done", function (stats) {
                stats = stats.toJson();
                console.error(JSON.stringify({
                    assetsByChunkName: stats.assetsByChunkName
                }));
            });
        }
    ]

}, require('./webpack.config.js'));

