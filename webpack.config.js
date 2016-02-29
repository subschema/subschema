require('es6-promise').polyfill();

var path = require('path');
var webpack = require('webpack');
var AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
    '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
    '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';


function config(filename, externals, extract) {
    extract = true;
    console.log('building', filename);
    var loaders = [
        {
            test: /\.js(x)?$/,
            include: /node_modules/,
            //do this to prevent babel fromt tanslating everything.
            loader: 'babel'
        },
        {test: /\.(png|jpe?g|mpe?g[34]?|gif)$/, loader: 'url-loader?limit=100000'},
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
        new webpack.optimize.DedupePlugin(),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            "window": 'window || __fakeWindow'
        }),
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
            contentBase: path.join(__dirname, ".build"),
            info: true, //  --no-info option
            hot: true,
            inline: true,
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
            loaders: loaders
        },


        plugins: plugins
    }
    if (extract) {
        conf.target = 'node';
        var ExtractTextPlugin = require("extract-text-webpack-plugin");
        loaders.push({
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!' + AUTOPREFIXER_LOADER)
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less-loader!' + AUTOPREFIXER_LOADER)
            });
        plugins.unshift(new webpack.DefinePlugin({
                "window": '{}'
            })
        )
        plugins.unshift(new ExtractTextPlugin("subschema.css"))
    } else {
        loaders.push({
                test: /\.css$/,
                loader: 'style-loader!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!' + AUTOPREFIXER_LOADER
            },
            {
                test: /\.less$/,
                loader: 'style!css!less?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!' + AUTOPREFIXER_LOADER
            });
        plugins.unshift(new webpack.optimize.UglifyJsPlugin({minimize: true, output: {comments: false}}));
    }
    return conf;
};
var externs = {
    "react": {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
    },
    './React': {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
    },
    "react-dom": {
        root: "ReactDOM",
        commonjs2: "react-dom",
        commonjs: "react-dom",
        amd: "react-dom"
    },
    "react-addons-css-transition-group": {
        "root": "ReactCSSTransitionGroup",
        "commonjs2": "react-addons-css-transition-group",
        "commonjs": "react-addons-css-transition-group",
        "amd": "react-addons-css-transition-group"
    },
    "fbjs": {
        "root": "fbjs",
        "commonjs2": "fbjs",
        "commonjs": "fbjs",
        "amd": "fbjs"
    }
};

var configs = [
    config('subschema.js'),
    config('subschema-noreact.js',
        [externs]
    ),
    config('subschema-server.js',
        [externs], true
    )
];
module.exports = configs;