var path = require('path');
var fs = require('fs');
var babel = require('./babel-helper');
var webpackUtils = require('./webpack-utils');
var deps = webpackUtils.deps,
    useAlias = webpackUtils.useAlias,
    useExternals = webpackUtils.useExternals,
    useExternalizePeers = webpackUtils.useExternalizePeers,
    useCustomConf = webpackUtils.useCustomConf,
    useDepAlias = webpackUtils.useDepAlias,
    dependency = webpackUtils.dependency;

function autoprefixer() {
    return [
        require('autoprefixer')({
            browsers: [
                '>1%',
                'last 3 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
            ]
        })
    ];
}


var plugins = [];
var opts = {
    isKarma: !!(process.env.SUBSCHEMA_KARMA),
    useCss: {
        loader: "css-loader",
        options: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[name]__[local]___[hash:base64:5]',
        }
    },
    usePostCss: {
        loader: 'postcss-loader',
        options: {
            plugins: autoprefixer
        }
    },
    useLess: {
        loader: "less-loader",
        options: {
            strictMath: true,
            noIeCompat: true
        }
    },
    useNameHash: process.env.SUBSCHEMA_USE_NAME_HASH ? true : false,
    analytics: process.env.SUBSCHEMA_USE_ANALYTICS,
};

if (process.env.SUBSCHEMA_NO_STYLE_LOADER) {
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    var extractCSS = new ExtractTextPlugin(opts.useNameHash ? '[hash].style.css' : 'style.css');
    opts.useStyle = function useStyleExtractText() {
        return extractCSS.extract(Array.prototype.slice.call(arguments));
    };
    plugins.push(extractCSS);
} else {
    opts.useStyle = function useStyleWithStyleLoader() {
        return ['style-loader'].concat(Array.prototype.slice.call(arguments));
    };
}

if (process.env.SUBSCHEMA_USE_STATS_FILE) {
    opts.useStatsFile = process.env.SUBSCHEMA_USE_STATS_FILE;
    plugins.push(new (require("webpack-stats-plugin").StatsWriterPlugin)({
        filename: process.env.SUBSCHEMA_USE_STATS_FILE,
        transform(data, opts){
            var chunks = data.assetsByChunkName["null"];
            return JSON.stringify({main: chunks[0], css: chunks[1]}, null, 2);
        }
    }))
}

var externals = useExternalizePeers(useExternals(externals));

var webpack = {
    devServer: {
        //      hot: true,
        filename: 'index.js',
        historyApiFallback: true,
        inline: true,
        contentBase: path.resolve(process.cwd(), 'public'),
        publicPath: '/',
        port: 8082
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: useDepAlias(useAlias())
    },
    resolveLoader: {
        modules: [
            path.resolve(process.cwd(), "node_modules"),
            path.resolve(__dirname, 'node_modules'),
        ]
    },
    plugins,
    externals,
    module: {
        rules: [

            {
                test: /\.jsx?$/,
                //       exclude: /(node_modules|bower_components)/,
                include: [/\/test\/*/, /\/src\/*/, /\/public\/*/, /subschema[^/]*\/src\/*/],
                use: [{
                    loader: 'babel-loader',
                    options: babel
                }]
            },
            {
                test: /\.css$/,
                use: opts.useStyle('css-loader')
            },
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml'},
            {
                test: /\.less$/,
                use: opts.useStyle(
                    opts.useCss,
                    opts.useLess,
                    opts.usePostCss)
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            }
        ]
    }
};


if (process.env.SUBSCHEMA_USE_HTML) {
    opts.useHtml = true;
    console.warn(`using html plugin`);
    function charset(ele) {
        if (!ele.attributes) ele.attributes = {};
        if (!ele.attributes.charset)
            ele.attributes.charset = 'UTF-8';
    }

    var HtmlWebpackPlugin = require('html-webpack-plugin');
    var ogenerateAssetTags = HtmlWebpackPlugin.prototype.generateAssetTags;
    HtmlWebpackPlugin.prototype.generateAssetTags = function (assets) {
        var ret = ogenerateAssetTags.call(this, assets);
        ret.body.forEach(charset);
        ret.head.forEach(charset);
        return ret;
    };
    if (opts.useNameHash) {
        webpack.devtool = 'source-map';
    } else {
        webpack.devtool = 'inline-source-map';
    }
    plugins.push(new HtmlWebpackPlugin({
        'title': (deps.description ? deps.description : deps.name),
        'hash': opts.useNameHash,
        'template': path.resolve(__dirname, 'public', opts.analytics ? 'index_analytics.ejs' : 'index.ejs'),
        'filename': 'index.html',
        analytics: opts.analytics
    }));
}
if (process.env.SUBSCHEMA_USE_HOT) {
    opts.useHot = true;
    console.warn('using hot loading');
    babel.plugins.unshift("react-hot-loader/babel");
    function modrequire(mod) {
        return require(mod);
    }

    babel.plugins = babel.plugins.map(modrequire);
    babel.presets = babel.presets.map(modrequire);
    var entry = process.argv[process.argv.indexOf('--entry') + 1];
    webpack.resolve.alias['webpack/hot/dev-server'] = require.resolve('webpack/hot/dev-server.js');

    webpack.entry = [
        require.resolve('webpack/hot/only-dev-server.js'),
        entry
    ];
}
var idx;
if ((idx = process.argv.indexOf('--target')) != -1) {
    opts.target = process.argv[idx + 1];
}

var customConf = useCustomConf();
if (customConf) {
    webpack = customConf(opts, webpack);
}
//Think hard if this should be the default.
if (!webpack.resolve.alias.subschema) {
    try {
        webpack.resolve.alias.subschema = require.resolve('subschema/dist/subschema-noreact');
    } catch (e) {
        //swallow?
    }
}

if (process.env.SUBSCHEMA_DEBUG) {
    console.warn('webpack', JSON.stringify(webpack, null, 2));
}
module.exports = webpack;