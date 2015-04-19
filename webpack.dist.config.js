var webpack = require('webpack'),
    merge = require('lodash/object/merge'),
    defaults = require('lodash/object/defaults'),
    version = require('./package.json').version, path = require('path');

console.log('out', path.join(__dirname, 'dist/'));
var def = {
    devtool: null,
    entry: {
        Subschema: './src/index.js'
    },
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: '[name].',
        chunkFilename: '[name].',
        publicPath: '/',
        // export itself to a global var
        libraryTarget: "umd",
        // name of the global var: "Foo"
        library: "Subschema"

    },
/*    externals: {
        'react': 'React',
        'lodash': '_'
    },*/
    module: {
        loaders: [
            {test: /\.js(x)?$/, exclude: /node_modules/, loader: 'babel-loader?stage=0'},
            {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000'},
            // Needed for the css-loader when [bootstrap-webpack](https://github.com/bline/bootstrap-webpack)
            // loads bootstrap's css.
//            / Needed for the css-loader when [bootstrap-webpack](https://github.com/bline/bootstrap-webpack)
// loads bootstrap's css.
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml"},
            // Optionally extract less files
            // or any other compile-to-css language
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!'
            },
            {
                test: /\.less$/,
                loader: 'style!css!less-loader'
            }
        ]
    },

    resolve: {
        alias: {
            'subschema': __dirname+'/src/index',
            'types': __dirname+'/src/types',
            'styles': __dirname+'/src/styles'
        }
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

module.exports = [
    //makeConf({name: 'umd.' + version}),
    //everything included.
    makeConf({
        name: 'everything-umd.' + version,
        externals: false,
        output: {
            filename: '[name].',
            // export itself to a global var
            libraryTarget: "umd"
        }
    }),
    //Just the app no compression.
    makeConf({
        name: 'example',
        entry: {
            'app': './public/app.jsx'
        },
        output: {
            filename: ''
        },
        /*externals: {
            subschema: './dist/Subschema.everything-umd.' + version+'.js'
        },*/
        plugins: [
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
    //full debug without compression and with sourcemap
    makeConf({
        name: 'debug.' + version,
        devtool: 'source-map',

        output: {
            filename: '[name].',
            chunkFilename: '[name].' + version,
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
    })
];

