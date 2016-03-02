"use strict";

require('es6-promise').polyfill();
var path = require('path');
var webpack = require('webpack');
var join = path.join.bind(path, __dirname);

module.exports = {
    devServer: {
        noInfo: true,
        hot: true,
        inline: true,
        contentBase: join('src'),
        publicPath: '/',
        port: 8084
    },
    devtool: '#inline-source-map',
    entry: {
        app: './src/index.jsx'
    },
	output:{
        path:join('.build'),
        filename: 'app.[hash].js'
    },
	target:"web",
    stats: {
        colors: true,
        reasons: true
    },
    module: {
        loaders: [
            {
                test: /\.js(x)?$/,
                exclude:/node_modules\/(?!(component-playground|subschema.*))/,
                loader: 'babel'
            },
            {test: /\.(png|jpe?g|mpe?g|gif)$/, loader: 'url-loader?limit=100000'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml"},
            // Optionally extract less files
            // or any other compile-to-css language
            {
                test: /\.css$/,
                loader: extractCSS.extract(['style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'])
//                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/,
                loader: extractCSS.extract(['style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]','less'])
      //               loaders: ['style','css','less']
            },
            {
                test:/\.json$/,
                loader:'json'
            }
        ]
    },
    postcss: [
        require('autoprefixer'),
        require('postcss-color-rebeccapurple')
    ],
    resolve: {
        extensions:['','.jsx','.js'],
        alias: {
            'subschema': join('src/index.jsx'),
            'Subschema': join('src')
        }
    },

    plugins: [
        extractCSS,
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
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

