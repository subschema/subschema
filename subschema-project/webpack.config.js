"use strict";

var path = require('path'), join = path.join.bind(path, __dirname);
var autoprefixer = require('autoprefixer');

var lifecycle = process.env['npm_lifecycle_event'] || '';
var isPrepublish = lifecycle === 'prepublish' || lifecycle === 'dist';
var isKarma = process.env['NODE_ENV'] === 'test';
var isTestDist = lifecycle === 'test-dist';
var isDemo = lifecycle == 'demo';
var isCli = /cli/.test(lifecycle);
var subschema = join('../subschema/src');
var cssStr = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss';

var config = {
        devtool: (isDemo || isPrepublish ? '#source-map' : "#inline-source-map"),
        devServer: {
            noInfo: true,
            hot: true,
            inline: true,
            contentBase: join('public'),
            publicPath: '/',
            port: 8082
        },
        resolve: {
            extensions: ['', '.jsx', '.js'],
            alias: {
                'fbjs': join('node_modules/fbjs'),
                'react': join('node_modules/react'),
                'React': join('node_modules/react'),
                './React': join('node_modules/react'),
                'react-dom': join('node_modules/react-dom'),
                'Subschema': subschema,
                'subschema-test-support': join('../subschema-test-support'),
                'subschema-source': join('../subschema/dist'),
                'subschema-project': isTestDist ? join('dist/index.js') : join('src/index.js'),
                'ValueManager':path.join(subschema, 'ValueManager')
            }
        },
        stats: {
            colors: true,
            reasons: true,
            info: true
        },
        module: {
            loaders: [
                {
                    test: /\.tmpl$/,
                    loader: join('tmpl-loader'),
                    include: [
                        join('src')
                    ]
                },

                {
                    test: /\.jsx?$/,
                    //do this to prevent babel from translating everything.
                    loader: 'babel',
                    exclude: [/dist/, /babylon\/.*/, /babel/],
                    include: [
                        join('src'),
                        join('public'),
                        join('samples'),
                        subschema,
                        /subschema-injection/,
                        join('test')
                    ]
                },
                {
                    test: /\.(png|jpe?g|mpe?g[34]?|gif)$/, loader: 'url-loader?limit=100000'
                }
                ,
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"
                }
                ,
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"
                }
                ,
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"
                }
                ,
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"
                }
                ,
                {
                    test: /\.json$/,
                    loader: 'json'
                }

            ]

        },
        postcss: [autoprefixer({
            browsers: ["Android 2.3", "Android >= 4",
                "Chrome >= 20", "Firefox >= 24",
                "Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]
        })],
        externals: (isPrepublish ? [{
            'react': {
                'var': 'React',
                'commonjs2': 'react',
                'commonjs': 'react'
            },
            'react-dom': {
                'var': 'ReactDOM',
                'commonjs': 'react-dom',
                'commonjs2': 'react-dom'
            },
            'babel-standalone-internal': {
                'var': 'Babel',
                'commonjs': 'babel',
                'commonjs2': 'babel'
            }
        }] : {
            'babel-standalone-internal': 'Babel'
        })
    }
    ;
config.module.loaders.push({
        test: /\.css$/,
        loader: 'null'
    }
    ,
    {
        test: /\.less$/,
        loader: 'null'
    });

module.exports = config;