var path = require('path');
var fs = require('fs');
var babel = require('./babel-helper');
var SUBSCHEMA_CONF = 'subschema-webpack.config.js';

function project() {
    return path.resolve(process.cwd(), path.join.apply(path, arguments));
};

var deps = require(project('./package.json'));

function wrapFunc(f) {
    if (!f) return;
    return function (conf, opts) {
        return f.call(this, conf, opts) || conf;
    }
}

function set(obj, key, value) {
    const keys = key.split('.');
    const last = keys.pop();
    let cobj = obj || {};
    while (keys.length) {
        const c = keys.shift();
        cobj = cobj[c] || (cobj[c] = {});
    }
    obj[last] = value;
    return obj;
}

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

function applyFuncs(f1, f2) {
    f1 = f1 && (f1.default ? f1.default : f1);
    f2 = f2 && (f2.default ? f2.default : f2);
    if (!f2) {
        return wrapFunc(f1);
    }
    if (!f1 && f2) {
        return wrapFunc(f2);
    }
    if (!f1 && !f2) {
        return null;
    }
    f1 = wrapFunc(f1);
    f2 = wrapFunc(f2);
    return function (conf, opts) {
        //keep scope.
        return f1.call(this, (f2.call(this, conf, opts)), opts);
    }
}
var customConf = null;
var alias = {};
if (process.env.SUBSCHEMA_USE_ALIASES) {
    process.env.SUBSCHEMA_USE_ALIASES.split(/,\s*/).forEach(function (key) {
        var parts = key.split('=', 2);
        this[parts[0]] = parts[1] || project('node_modules', parts[0]);
    }, alias);
}
[deps.name].concat(Object.keys(deps.dependencies || {}), Object.keys(deps.devDependencies || {}), Object.keys(deps.peerDependencies || {})).reduce(function (ret, key) {
    if (key in ret) return ret;
    if (fs.existsSync(project('..', key, SUBSCHEMA_CONF))) {
        customConf = applyFuncs(customConf, require(project('..', key, SUBSCHEMA_CONF)));
        console.warn(`using custom config for ${key}`);
    } else {
        var resolvedTo;
        try {
            resolvedTo = require.resolve(`${key}/${SUBSCHEMA_CONF}`);
        } catch (e) {
            //swallow it probably does not exists.
        }
        if (resolvedTo) {
            //don't swallow. because it does exist but theres a problem;
            customConf = applyFuncs(customConf, require(resolvedTo));
            console.warn(`using custom config for ${key}`);

        }
    }
    if (/subschema(?!-dev-support$)/.test(key) && fs.existsSync(project('..', key, 'package.json'))) {
        ret[key + '/lib/style.css'] = project('..', key, 'lib', 'style.css');
        ret[key + '/lib'] = project('..', key, 'src');

        ret[key] = project('..', key, 'src');
    }
    return ret;
}, alias);

var plugins = [];
var externals = {};
var opts = {
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
    const extractCSS = new ExtractTextPlugin(opts.useNameHash ? '[hash].style.css' : 'style.css');
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
if (process.env.SUBSCHEMA_USE_EXTERNALS) {
    /**lodash : {
    commonjs: "lodash",
    amd: "lodash",
    root: "_" // indicates global variable
    lodash.commonjs=lodash,lodash.amd=lodash,lodash.root=lodash,
    react,react-dom
    {
      react:react
    }
  }**/
    externals = process.env.SUBSCHEMA_USE_EXTERNALS.split(/,\s*/).reduce(function (ret, key) {
        const [k, v] = key.split(/\s*=\s*/, 2);
        set(ret, k, v || k);
        return ret;
    }, {});
}
if (process.env.SUBSCHEMA_EXTERNALIZE_PEERS) {
    var localPkg = path.resolve(process.cwd(), 'package.json');
    var peers = require(localPkg).peerDependencies;
    if (!peers) {
        console.warn(`using --externalize-peers however there are no peerDependencies in ${localPkg}`);
    } else {
        Object.keys(peers).reduce(function (ret, key) {
            if (!(key in ret)) {
                ret[key] = key;
            }
            return ret;
        }, externals);
    }
}

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
        alias

    },
    resolveLoader: {
        modules: [
            path.resolve(process.cwd(), "node_modules"),
            path.resolve(__dirname, 'node_modules')
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
if (customConf) {
    webpack = customConf(webpack, opts);
}

if (!webpack.resolve.alias.subschema){
    webpack.resolve.alias.subschema = require.resolve('subschema/dist/subschema-noreact');
}

if (process.env.SUBSCHEMA_DEBUG) {
    console.warn('webpack', JSON.stringify(webpack, null, 2));
}
module.exports = webpack;