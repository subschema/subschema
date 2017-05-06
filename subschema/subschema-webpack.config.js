var path = require('path');
var webpackUtils = require('subschema-dev-support/webpack-utils');
var pkg = require('./package.json');
module.exports = function (options, webpack) {
    webpack.module.rules.push({
        test: path.resolve(__dirname, 'src', 'DefaultLoader.js'),
        use: {
            loader: path.resolve(__dirname, 'node_modules', 'val-loader'),
            options: {dependencies: webpackUtils.concatFilteredDependencies(pkg)}

        }
    });
    //make sure everyone uses the same lodash.
    webpack.resolve.alias.lodash = path.resolve(__dirname, 'node_modules', 'lodash');
    return webpack;

};