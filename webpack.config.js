require('es6-promise').polyfill();
var path = require('path');
var extend = require('lodash/object/extend');
var webpack = require('webpack');
var AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
    '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
    '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';
function config(filename, externals, alias) {
    return {
        devtool: 'eval',
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
        resolve: {
            // Allow require('./blah') to require blah.jsx
            extensions: ['', '.js', '.jsx']
        },
        output: {
            path: path.join(__dirname, "dist"),
            filename: filename,
            libraryTarget: 'umd',
            library: 'Subschema'
        },
        externals: externals,
        resolve: {
            alias: alias
        },
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
                        '~/node_modules/react-dom',
                        '~/node_modules/fbjs',
                       // '~/node_modules/react-router',
                       // '~/node_modules/react-bootstrap',
                        '~/node_modules/subschema-builder'

                    ],
                    loaders: ['babel-loader?stage=0&externalHelpers']
                },
                {test: /\.(png|jpe?g|mpe?g[34]?|gif)$/, loader: 'url-loader?limit=100000'},
                {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
                {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream"},
                {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
                //       {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml"},
                // Optionally extract less files
                // or any other compile-to-css language
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader!' + AUTOPREFIXER_LOADER
                },
                {
                    test: /\.less$/,
                    loader: 'style!css!less-loader!' + AUTOPREFIXER_LOADER
                }
            ]
        },


        plugins: [

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
    }

};

var configs = [
    config('subschema.js'),

    config('subschema-noreact.js',
        {
            //don't bundle the 'react' npm package with our bundle.js
            //but get it from a global 'React' variable

            'react': 'React',
            'react/addons': 'React',
        }/*, {
            'react/lib/CSSCore': path.join(__dirname, 'node_modules/react/lib/CSSCore'),
            'react/lib/Object.assign': path.join(__dirname, 'node_modules/react/lib/Object.assign'),
            'react/lib/ReactTransitionEvents': path.join(__dirname, 'node_modules/react/lib/ReactTransitionEvents'),
         //   'react/lib/ReactTransitionGroup': path.join(__dirname, 'node_modules/react/lib/ReactTransitionGroup'),
            'react/lib/onlyChild': path.join(__dirname, 'node_modules/react/lib/onlyChild'),
            'react/lib/warning': path.join(__dirname, 'node_modules/react/lib/warning')
        }*/
    )]
module.exports = configs;