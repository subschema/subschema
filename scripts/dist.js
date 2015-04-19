#!/usr/bin/env node 
var webpack = require("webpack"), configs = require('../webpack.dist.config.js').slice(0);

(function run(conf) {
    if (conf.name)
        conf.output.filename += conf.name + '.js'

    console.log('compiling', conf.name);
    webpack(conf, function (err, stats) {
        // console.log('stats', stats);
        if (err) {
            console.log('err with ' + i, err);
            process.exit(1);
        }
        if (!configs.length) {
            console.log('done');
            process.exit(0);
        } else {
            run(configs.shift())
        }

    });
})(configs.shift());
