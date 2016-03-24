"use strict";
var path = require('path'), join = path.join.bind(path, __dirname);
var lifecycle = process.env['npm_lifecycle_event'];
var isTest = /test/.test(lifecycle);
var isExternal = /external/.test(lifecycle);
var webpack = require('webpack');
var config = {

    entry: join('src/index'),
    target: 'node',
    resolve: {
        alias: {
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
                exclude: [/dist/],
                query: {
                    presets: ['es2015', 'stage-0']
                }
            }]
    }

};
if (isExternal) {
    config.externals = [{
        Subschema: {
            commonjs: 'subschema',
            commonjs2: 'subschema',
            root: 'Subschema'
        }
    }];
} else {
    Object.assign(config.resolve.alias, {
        'subschema-prop-types': join('shim/empty'),
        'subschema': join('../subschema/src/'),
        'Subschema': join('shim/Subschema'),
        'react': join('shim/react'),
        'React': join('shim/react'),
    })
}
console.log(isTest ? 'Test' : 'dist', ' ', isExternal ? 'External' : '', ' ');
if (isTest) {

    if (!config.externals) {
        config.externals = [];
    }
    config.externals.push({Subschema: isExternal ? join('./externals') : join('dist/index')});
}
module.exports = config;