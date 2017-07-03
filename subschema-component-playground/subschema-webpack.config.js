var path       = require('path');
module.exports = function (options, webpack) {
    webpack.resolve.alias['babel-core'] =
        path.resolve(__dirname, 'node_modules', 'babel-standalone');

    return webpack;
};
