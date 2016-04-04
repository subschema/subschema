require('es6-promise').polyfill();

var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var join = path.join.bind(path, __dirname);
var cssStr = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss';

function externs() {
    return {
        "react": {
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
    }
};

function config(filename, externals, isNode, isMinify) {
    if (externals === true) {
        externals = externs();
    }
    console.log('building', filename, isNode);
    var loaders = [
        {
            test: /\.jsx?$/,
            exclude: /node_modules\/(?!(subschema.*))/,
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
            test: /\.json$/,
            loader: 'json'
        }
    ];
    if (isMinify) {
        loaders.push({
            test: /\.js(x)?$/,
            exclude: /node_modules/,
            loader: "strip-loader?strip[]=debug,strip[]=debugger,strip[]=console.log"
        });
    }
    var plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
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
        name: filename,
        devtool: 'source-map',
        entry: {
            subschema: (isNode ? './src/index.jsx' : './src/dist.js' )
        },
        devServer: {
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
        externals: externals,

        resolve: {
            extensions: ['', '.js', '.jsx'],
            alias: {
                'fbjs': join('node_modules/fbjs'),
                'subschema-prop-types': join('node_modules/subschema-prop-types/src/index.js')
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

        postcss: [autoprefixer({
            browsers: ["Android 2.3", "Android >= 4",
                "Chrome >= 20", "Firefox >= 24",
                "Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]
        })],
        plugins: plugins
    };
    if (!isNode) {
        if (externals) {
            conf.resolve.alias['react'] = join('./shim/react');
            conf.resolve.alias['react-dom'] = join('./shim/react-dom');
            conf.resolve.alias['react/lib/ReactCSSTransitionGroupChild'] = join('node_modules/react/lib/ReactCSSTransitionGroupChild');
            //       conf.resolve.alias['react-addons-css-transition-group'] = join('./shim/react-addons-css-transition-group');
            conf.resolve.alias['react-internal'] = join('node_modules/react');

            //These 3 are for ReactCSSTransitionGroupChild
            externals['./React'] = {
                root: "React",
                commonjs2: "react",
                commonjs: "react",
                amd: "react"
            };
            externals['./ReactDOM'] = {
                root: "ReactDOM",
                commonjs2: "react-dom",
                commonjs: "react-dom",
                amd: "react-dom"
            };

        } else {
            loaders.push({test: require.resolve("react"), loader: "expose?React"});
            loaders.push({test: require.resolve("react-dom"), loader: "expose?ReactDOM"});
        }

        loaders.push({
                test: /\.css$/,
                loader: 'style!' + cssStr
            },
            {
                test: /\.less$/,
                loader: 'style!' + cssStr + '!less'
            });


    } else {
        var ExtractTextPlugin = require('extract-text-webpack-plugin');
        var extractCSS = new ExtractTextPlugin('./subschema.css');
        conf.target = 'node';
        loaders.push({
                test: /\.css$/,
                loader: extractCSS.extract([cssStr])
            },
            {
                test: /\.less$/,
                loader: extractCSS.extract([cssStr, 'less'])
            });
        plugins.unshift(extractCSS);

    }
    if (isMinify) {
        //       plugins.unshift(  new webpack.optimize.DedupePlugin(),new webpack.optimize.UglifyJsPlugin({minimize: true, output: {comments: false}}));

    }
    return conf;
};

module.exports = config;