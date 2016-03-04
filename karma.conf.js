var webpack = require('webpack'),
    path = require('path'),
    join = path.join.bind(path, __dirname),
    files = ['test/index.js'],
    lifecycle = process.env['npm_lifecycle_event'],
    config = require('./internal.webpack.config'),

    isDist = /dist/.test(lifecycle);
var demoCfg;
if (isDist) {
    demoCfg = config('karma-dist', [
        {subschema: 'Subschema'},
        {Subschema: 'Subschema'},
        {react: 'React'},
        {'react-dom': 'ReactDOM'},
 //       {'react-addons-test-utils': 'React.addons.TestUtils'}
    ], false);
    demoCfg.resolve.alias['react-addons-test-utils'] = join('test/react-addons-test-utils');
    demoCfg.resolve.alias['react-addons-css-transition-group'] = join('test/react-addons-test-utils');
    files.unshift(
//         'node_modules/react/dist/react.js',

        'node_modules/react/dist/react-with-addons.js',
        'node_modules/react-dom/dist/react-dom.js',
        {pattern: 'dist/subschema-noreact.js', included: true, served: true},
        {pattern: 'dist/subschema-noreact.js.map', included: false, served: true}
    );
} else {
    demoCfg = config('karma');
    files.unshift({pattern: './test/with-bootstrap.js', included: true, served: true});
}
demoCfg.resolve.alias['subschema-test-support'] = join('node_modules/subschema-test-support/src/index');
demoCfg.resolve.alias['subschema-test-support/samples'] = join('node_modules/subschema-test-support/samples');

delete demoCfg.entry;

demoCfg.devtool = 'inline-source-map';

demoCfg.module.loaders.unshift({
    test: /-setup\.js/,
    include: join("node_modules/subschema-test-support/samples"),
    loader: 'subschema-test-support'
});
demoCfg.resolve.alias = {
        'subschema': join('src/index.jsx'),
        'Subschema': join('src/index.jsx')
};

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
