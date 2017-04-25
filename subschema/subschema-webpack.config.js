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
    return webpack;

};