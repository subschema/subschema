var path = require('path');
module.exports = function (webpack) {
    webpack.resolve.alias['babel-core'] = path.resolve(__dirname, 'node_modules', 'babel-standalone');
    return webpack;
};
