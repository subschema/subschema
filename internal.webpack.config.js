require('es6-promise').polyfill();

var path = require('path');
var webpack = require('webpack');
var AUTOPREFIXER_LOADER = 'autoprefixer?{browsers:[' +
    '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
    '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';

var join = path.join.bind(path, __dirname);
var cssStr = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]';
function config(filename, externals, isNode) {
    console.log('building', filename, isNode);
    var loaders = [
        {
            test: /\.js(x)?$/,
            exclude:/node_modules\/(?!(subschema.*))/,
            loader: 'babel'
        },
        {test: /\.(png|jpe?g|mpe?g[34]?|svg|gif)$/, loader: 'url-loader?limit=100000'},
        {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream"},
        {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
        //       {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml"},
        // Optionally extract less files
        // or any other compile-to-css language

        {
            test: /\.js(x)?$/,
            exclude: /node_modules/,
            loader: "strip-loader?strip[]=debug,strip[]=debugger,strip[]=console.log"
        }, {
            test: /\.json$/,
            loader: 'json'
        }
    ];
    var plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.DedupePlugin(),
        function () {
            this.plugin("done", function (stats) {
                stats = stats.toJson();
                console.error('done with filename', filename);
                console.error(JSON.stringify({
                    assetsByChunkName: stats.assetsByChunkName
                }));
            });
        }
    ];

    var conf = {
        devtool: 'source-map',
        entry: {
            subschema: './src/index.jsx'
        },
        devServer: {
            noInfo: true,
            hot: true,
            inline: true,
            contentBase: join('src'),
            publicPath: '/',
            port: 8084
        },
        output: {
            path: path.join(__dirname, "dist"),
            filename: filename,
            sourceMapFilename: '[file].map',
            libraryTarget: 'umd',
            library: 'Subschema',
            pathinfo: false
        },
        postcss: [
            require('autoprefixer'),
            require('postcss-color-rebeccapurple')
        ],
        externals: externals,
        resolve: {
            extensions: ['', '.js', '.jsx'],
            alias: {
                'fbjs': path.join(__dirname, 'node_modules/fbjs')
            }
        },
        stats: {
            colors: true,
            reasons: true
        },
        module: {
            extensions: ['', '.jsx', '.js'],
            loaders: loaders
        },


        plugins: plugins
    };
    if (!isNode) {
        loaders.push({
                test: /\.css$/,
                loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
            },
            {
                test: /\.less$/,
                loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less'
            });


    } else {
        var ExtractTextPlugin = require('extract-text-webpack-plugin');
        var extractCSS = new ExtractTextPlugin('./subschema.css');
        conf.target = 'node';
        loaders.push({
                test: /\.css$/,
                loader: extractCSS.extract([cssStr, AUTOPREFIXER_LOADER])
            },
            {
                test: /\.less$/,
                loader: extractCSS.extract([cssStr, AUTOPREFIXER_LOADER, 'less'])
            });
        plugins.unshift(extractCSS);
        plugins.unshift(new webpack.optimize.UglifyJsPlugin({minimize: true, output: {comments: false}}));
    }

    return conf;
};

module.exports = config;