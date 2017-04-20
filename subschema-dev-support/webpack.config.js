var path = require('path');
var fs = require('fs');
var project = function (...args) {
    let p = path.resolve(process.cwd(), path.join(...args));
    return p;
};

const deps = require(project('./package.json'));

const alias = Object.keys(deps.dependencies || {}).concat(Object.keys(deps.devDependencies || {})).reduce(function (ret, key) {
    if (/subschema/.test(key)) {
        ret[key + '/lib/style.css'] = project('..', key, 'lib', 'style.css');
        ret[key + '/lib'] = project('..', key, 'src');
        ret[key] = project('..', key, 'src');
    }
    return ret;
}, {[deps.name]: project('src')});

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
var externals = {};
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
                include: [/test\/*/, /src\/*/, /subschema*\/src\/*/],
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
var customWebpack = path.resolve(process.cwd(), 'webpack.subschema.js');
if (fs.existsSync(customWebpack)) {
    var custom = require(customWebpack);
    custom = custom.default || custom;
    var backup = webpack;
    webpack = typeof custom == 'function' ? custom(webpack) : custom;
    if (!webpack) webpack = backup;
}
module.exports = webpack;