var webpack = require('webpack'),
    path = require('path'),
    join = path.join.bind(path, __dirname),
    demoCfg = require('./demo.webpack.config.js')
;

demoCfg.resolve.alias.Subschema = join('src/index.jsx');

var lifecycle = process.env['npm_lifecycle_event'];
var isKarma = /karma/.test(lifecycle);

if (isKarma) {
   // demoCfg.plugins.unshift(new webpack.HotModuleReplacementPlugin());
    demoCfg.devServer.hot = false;
    demoCfg.devServer.inline = false;
}
delete demoCfg.entry;
demoCfg.devtool = 'inline-source-map';
demoCfg.module.loaders.unshift({
    test:/-setup\.js/,
    loader:join('./test/support/sample-loader.js')
});
module.exports = function (config) {
    config.set({
        browserNoActivityTimeout: 20000,
        browsers: ['Chrome'], //run in Chrome
        singleRun: true, //just run once by default
        frameworks: ['mocha'], //use the mocha test framework
        files: [
            'test/index.js' //just load this file
        ],
        preprocessors: {
            'test/*': ['webpack', 'sourcemap'] //preprocess with webpack and our sourcemap loader
        },
        reporters: ['dots'], //report results in this format

        webpack: demoCfg,

        webpackMiddleware: {
            stats: {
                colors: true
            }
        }
    });

};
