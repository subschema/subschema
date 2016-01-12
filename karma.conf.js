var webpack = require('webpack'),
    path = require('path'),
    join = path.join.bind(path, __dirname),
    demoCfg = require('./demo.webpack.config.js'),
    files = ['test/index.js'],
    lifecycle = process.env['npm_lifecycle_event'],
    isDist = /dist/.test(lifecycle);

if (isDist) {
    files.unshift(
        'node_modules/react/dist/react-with-addons.js',
        'node_modules/react-dom/dist/react-dom.js',
        {pattern: 'dist/subschema-noreact.js', included: true, served: true},
        {pattern: 'dist/subschema-noreact.js.map', included: false, served: true}
    );
    demoCfg.resolve.alias = {};
    demoCfg.externals = {
        subschema: 'Subschema',
        Subschema: 'Subschema',
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-addons-test-utils': 'React.addons.TestUtils'
    };
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
