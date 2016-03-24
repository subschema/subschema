"use strict";
var path = require('path'), join = path.join.bind(path, __dirname);

var config = {

    entry: join('src/index'),
    target: 'node',
    resolve: {
        alias: {
            'subschema-prop-types': join('shim/empty'),
            'subschema': join('../subschema/src'),
            'Subschema': join('shim/Subschema'),
            'react': join('shim/react'),
            'React': join('shim/react'),
            'subschema-server-utils': join('dist/index')
        }

    },

    stats: {
        colors: true,
        reasons: true,
        info: true
    },
    module: {
        loaders: [
            {
                test: /.jsx$/,
                loader: null
            },
            {
                test: /.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-0']
                }
            }]
    }

};
var isTest = /test/.test(process.env['npm_lifecycle_event']);
if (isTest) {
    console.log('isTest');
    if (!config.externals) {
        config.externals = {};
    }
    config.externals.Subschema = join('dist/index');
}
module.exports = config;