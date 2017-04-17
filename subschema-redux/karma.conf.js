const demoCfg = require('../subschema/karma.conf');
const path = require('path');

module.exports = function (config) {
    return demoCfg({
        set: function (konf) {
            konf.files.push(path.join(__dirname, 'test', 'index.js'));
            konf.webpack.resolve.alias.ValueManager = path.join(__dirname, 'src', 'ReduxValueManager');
            konf.webpack.resolve.alias['babel-polyfill'] = path.join(__dirname, 'test', 'empty.js');
            konf.webpack.resolve.root = [path.join(__dirname, 'test')];
            konf.preprocessors['test/*'] = ['webpack', 'sourcemap'], //preprocess with webpack and our sourcemap loader

                console.log('konf', JSON.stringify(konf, null, 2));
            config.set(konf);
        }
    })
};
