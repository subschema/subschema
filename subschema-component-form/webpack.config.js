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
            }
        ]
    }
};
console.log('webpack', JSON.stringify(webpack, null, 2));
module.exports = webpack;