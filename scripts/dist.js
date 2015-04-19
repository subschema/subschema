#!/usr/bin/env node 
var webpack = require("webpack");
var configs = require('../webpack.dist.config.js');
var count = configs.length;
configs.forEach(function (conf, i) {
    if (conf.name)
        conf.output.filename += conf.name + '.js'

    console.log('compiling', conf.name);
    webpack(conf, function (err, stats) {
       // console.log('stats', stats);
        if (err) {
            console.log('err with ' + i, err);
            process.exit(1);
        }
        if (--count === 0) {
            console.log('done');
            process.exit(0);
        }

    });
})
