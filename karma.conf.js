var webpack = require('webpack'),
    path = require('path'),
    join = path.join.bind(path, __dirname),
    demoCfg = require('./demo.webpack.config.js')
    ;

var files = ['test/index.js'];
var lifecycle = process.env['npm_lifecycle_event'];
var isDist = /dist/.test(lifecycle), isKarma = /karma/.test(lifecycle);
if (isDist) {
    files.unshift(
        'node_modules/react/dist/react-with-addons.js',
        'node_modules/react-dom/dist/react-dom.js',
        {pattern: 'dist/subschema-noreact.js', included: true, served: true},
        {pattern: 'dist/subschema-noreact.js.map', included: false, served: true}
    );
    demoCfg.resolve.alias = {};
    demoCfg.externals = {};
    demoCfg.externals.subschema = 'Subschema';
    demoCfg.externals.Subschema = 'Subschema';
    demoCfg.externals.react = 'React';
    demoCfg.externals['react-dom'] = 'ReactDOM';
    demoCfg.externals['react-addons-test-utils'] = 'React.addons.TestUtils';

//    demoCfg.resolve.alias.subschema = demoCfg.resolve.alias.Subschema = join('dist/subschema-noreact.js');
} else {
    demoCfg.resolve.alias.Subschema = join('src/index.jsx');
}
demoCfg.devServer.hot = false;
demoCfg.devServer.inline = false;
delete demoCfg.entry;
demoCfg.devtool = 'inline-source-map';

demoCfg.module.loaders.unshift({
    test: /-setup\.js/,
    loader: join('./test/support/sample-loader.js')
});
console.log('files', files);

module.exports = function (config) {
    config.set({
        browserNoActivityTimeout: 20000,
        browsers: ['Chrome'], //run in Chrome
        singleRun: true, //just run once by default
        frameworks: ['mocha'], //use the mocha test framework
        files: files,
        preprocessors: {
            'test/*': ['webpack', 'sourcemap'], //preprocess with webpack and our sourcemap loader
            'dist/*': ['sourcemap']
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
