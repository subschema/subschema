var webpack = require('webpack'), merge = require('lodash/object/merge'), defaults = require('lodash/object/defaults'), version = require('./package.json').version, path = require('path');

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

module.exports = [makeConf({name: 'umd.' + version}),
    //everything included.
    makeConf({
        name: 'everything-amd.' + version,
        externals: false,
        output: {
            filename: '[name].',
            chunkFilename: '[name].',

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
        externals: {
            subschema: './Subschema.everything-amd.' + version+'.js'
        },
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

