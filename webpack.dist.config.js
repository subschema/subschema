var webpack = require('webpack'), merge = require('lodash/object/merge'), defaults = require('lodash/object/defaults'), version = require('./package.json').version;
var compressionPlugin = new require("compression-webpack-plugin")({
    asset: "{file}.gz",
    algorithm: "gzip",
    regExp: /\.js$|\.html$/,
    threshold: 10240,
    minRatio: 0.8
});
var def = {
    devtool: null,
    entry: {
        'example-app': './public/app.jsx',
        Subschema: './src/index.js'
    },
    output: {
        path: 'dist/',
        filename: '[name].' + version + '-umd.js',
        chunkFilename: '[name].' + version + '-umd.js',
        publicPath: '/',
        // export itself to a global var
        libraryTarget: "umd",
        // name of the global var: "Foo"
        library: "Subschema"

    },
    externals: {
        'react': 'React',
        'lodash': '_'
    },

    plugins: [
        //   new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.NoErrorsPlugin(),
//        compressionPlugin,
        function () {
            this.plugin("done", function (stats) {
                stats = stats.toJson();
                console.error(JSON.stringify({
                    assetsByChunkName: stats.assetsByChunkName
                }));
            });
        }
    ]

};
function makeConf(conf) {
    var edef = merge({}, def, conf);
    var ret = defaults(edef, require('./webpack.config.js'))
    return ret;
}

module.exports = [makeConf({}), makeConf({
    externals:false,
    output: {
        filename: '[name].' + version + '-everything-amd.js',
        chunkFilename: '[name].' + version + '-everything-amd.js',

        // export itself to a global var
        libraryTarget: "umd"
    }
}),makeConf({}), makeConf({
    output: {
        filename: '[name].' + version + '-amd.js',
        chunkFilename: '[name].' + version + '-amd.js',
        // export itself to a global var
        libraryTarget: "amd"
    }
}), makeConf({
    devtool: 'source-map',
    output: {
        filename: '[name].' + version + '-debug.js',
        chunkFilename: '[name].' + version + '-debug.js',
        // export itself to a global var
        libraryTarget: "amd"
    },

    plugins: [
        //   new webpack.optimize.CommonsChunkPlugin('common.js'),
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
}),
];

