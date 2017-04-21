var path = require('path');
var fs = require('fs');
var project = function (...args) {
    return path.resolve(process.cwd(), path.join(...args));
};

var deps = require(project('./package.json'));
function wrapFunc(f) {
    if (!f) return;
    return function (conf, opts) {
        return f.call(this, conf, opts) || conf;
    }
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
var SUBSCHEMA_CONF = 'subschema-webpack.config.js';
var customConf = null;
var alias = [deps.name].concat(Object.keys(deps.dependencies || {}), Object.keys(deps.devDependencies || {}), Object.keys(deps.peerDependencies || {})).reduce(function (ret, key) {
    if (key in ret) return ret;
    if (fs.existsSync(project('..', key, SUBSCHEMA_CONF))) {
        customConf = applyFuncs(customConf, require(project('..', key, SUBSCHEMA_CONF)));
        console.log(`using custom config for ${key}`);
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
            console.log(`using custom config for ${key}`);

        }
    }
    if (/subschema/.test(key) && fs.existsSync(project('..', key, 'package.json'))) {
        ret[key + '/lib/style.css'] = project('..', key, 'lib', 'style.css');
        ret[key + '/lib'] = project('..', key, 'src');

        ret[key] = project('..', key, 'src');
    }
    return ret;
}, {});

const autoprefixer = function () {
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
};
var plugins = [];
var externals = [];
var useStyle;
if (process.env.SUBSCHEMA_NO_STYLE_LOADER) {
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    const extractCSS = new ExtractTextPlugin(process.env.SUBSCHEMA_USE_STATS_FILE ? '[hash].style.css' : 'style.css');
    useStyle = function useStyleExtractText() {
        return extractCSS.extract(Array.prototype.slice.call(arguments));
    };
    plugins.push(extractCSS);
} else {
    useStyle = function useStyleWithStyleLoader() {
        return ['style-loader'].concat(Array.prototype.slice.call(arguments));
    };
}

if (process.env.SUBSCHEMA_USE_STATS_FILE) {
    plugins.push(new (require("webpack-stats-plugin").StatsWriterPlugin)({
        filename: process.env.SUBSCHEMA_USE_STATS_FILE,
        transform(data, opts){
            var chunks = data.assetsByChunkName["null"];
            return JSON.stringify({main: chunks[0], css: chunks[1]}, null, 2);
        }
    }))
}
if (process.env.SUBSCHEMA_USE_EXTERNALS) {
    //react,...
    externals = process.env.SUBSCHEMA_USE_EXTERNALS.split(/,\s*/);
}

var webpack = {
    devServer: {
        noInfo: true,
        hot: true,
        inline: true,
        contentBase: path.resolve(process.cwd(), 'public'),
        publicPath: '/',
        port: 8082
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias
    },
    plugins,
    externals,
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                //       exclude: /(node_modules|bower_components)/,
                include: [/test\/*/, /src\/*/, /public\/*/, /subschema*\/src\/*/],
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: useStyle('css-loader')
            },
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml'},
            {
                test: /\.less$/,
                use: useStyle(
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]___[hash:base64:5]',
                        }
                    },
                    {
                        loader: "less-loader",
                        options: {
                            strictMath: true,
                            noIeCompat: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: autoprefixer
                        }
                    })
            }
        ]
    }
};


if (process.env.SUBSCHEMA_USE_HTML) {
    var HtmlWebpackPlugin = require('html-webpack-plugin');
    if (!webpack.output) webpack.output = {};
    webpack.output.path = path.resolve(process.cwd(), '.tmp');
    webpack.output.filename = '[name].bundle.js';
    plugins.push(new HtmlWebpackPlugin({
        'title': deps.name + (deps.description ? `:${deps.description}` : ''),
        'filename': path.resolve(__dirname, 'public', 'index.html')
    }));
}

if (customConf) {
    webpack = customConf(webpack);
}
module.exports = webpack;