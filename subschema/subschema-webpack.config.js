var path = require('path');
var packagePath = path.resolve(process.cwd(), 'package.json')
module.exports = function (webpack, options) {
    webpack.module.rules.push({
        test: path.resolve(__dirname, 'src', 'DefaultLoader.js'),
        use: {
            loader: 'val-loader',
            options: {
                package: require(packagePath),
                packagePath
            }
        }
    });
    //make sure everyone uses the same lodash.
    webpack.resolve.alias.lodash = path.resolve(__dirname, 'node_modules', 'lodash');
    return webpack;

};