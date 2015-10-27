require('es6-promise').polyfill();
var path = require('path');
var hot = require('./hot.web')
var webpack = require('webpack');
var AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
    '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
    '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';

module.exports = {

    devtool: 'source-map',
    entry: {
        app: './public/app.jsx'
    },
	output:{
        path: path.join(__dirname, '../subschema-gh-pages'),
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
                excludes: /node_modules/,
                //do this to prevent babel fromt tanslating everything.
                includes: [
                    '~/node_modules/react',
                    '~/node_modules/react-router',
                    '~/node_modules/react-bootstrap',
                    '~/node_modules/subschema-builder',
                    '~/node_modules/react-highlight'

                ],
                loaders: ['babel-loader?stage=0']
            },
            {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml"},
            // Optionally extract less files
            // or any other compile-to-css language
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!' + AUTOPREFIXER_LOADER
            },
            {
                test: /\.less$/,
                loader: 'style!css!less-loader'
            }
        ]
    },

    resolve: {
        alias: {
            'subschema':path.join( __dirname, 'src/index.jsx'),
            'react': path.join(__dirname, '/node_modules/react')
        }
    },

    plugins: [

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
		//new webpack.optimize.DedupePlugin(),
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

