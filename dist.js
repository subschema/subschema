var webpack = require("webpack");
var configs = require('./webpack.dist.config.js');
var count = configs.length;
configs.forEach(function (conf, i) {
    console.log('compiling', i);

    webpack(conf, function (err, stats) {
        console.log('compiling', i);
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
