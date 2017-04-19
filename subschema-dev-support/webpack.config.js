var path = require('path');
var fs = require('fs');
var project = function (...args) {
    let p = path.resolve(process.cwd(), path.join(...args));
    return p;
};
const deps = require(project('./package.json'));

const alias = Object.keys(deps.dependencies || {}).concat(Object.keys(deps.devDependencies || {})).reduce(function (ret, key) {
    if (/subschema/.test(key)) {
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

var webpack = {
    devtool: '#inline-source-map',
    resolve: {
        extensions: ['.js', '.jsx'],
        alias
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                //       exclude: /(node_modules|bower_components)/,
                include: [/test\/*/, /src\/*/, /subschema*\/src\/*/],
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml'},
            {
                test: /\.less$/,
                use: [
                    "style-loader",
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
                    }
                ]
            }
        ]
    }
};
module.exports = webpack;