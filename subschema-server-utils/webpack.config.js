"use strict";
var path = require('path'), join = path.join.bind(path, __dirname);
var lifecycle = process.env['npm_lifecycle_event'];
var isTest = /(test|karma)/.test(lifecycle);

var isExternal = /external/.test(lifecycle);
var webpack = require('webpack');
var config = {

    entry: join('src/index'),
    target: 'node',
    resolve: {
        extensions: ['', '.js', '.jsx'],

        alias: {
            'subschema-server-utils': join('dist/index'),
            //      'Subschema': join('node_modules/subschema/dist/subschema-server.js')
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
                test: /\.(css|less)$/,
                loader: 'null'
            },
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: [/dist/],
                query: {
                    presets: ["es2015-loose",
                        "stage-0"]
                }
            }]
    }

};
//if (isExternal) {
config.externals = [{
    Subschema: {
        commonjs: 'subschema',
        commonjs2: 'subschema',
        root: 'Subschema'
    }
}];
//}
console.log(isTest ? 'Test' : 'dist', ' ', isExternal ? 'External' : '', ' ');
if (isTest) {

    /*    if (!config.externals) {
     config.externals = [];
     }
     config.externals.push({Subschema:join('node_modules/dist/subschema-server')});*/
}
module.exports = config;