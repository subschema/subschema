"use strict";
var config = require('./internal.webpack.config');
var externs = {
    "react": {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
    },
    './React': {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
    },
    "react-dom": {
        root: "ReactDOM",
        commonjs2: "react-dom",
        commonjs: "react-dom",
        amd: "react-dom"
    },
    "react-addons-css-transition-group": {
        "root": "ReactCSSTransitionGroup",
        "commonjs2": "react-addons-css-transition-group",
        "commonjs": "react-addons-css-transition-group",
        "amd": "react-addons-css-transition-group"
    },
    "fbjs": {
        "root": "fbjs",
        "commonjs2": "fbjs",
        "commonjs": "fbjs",
        "amd": "fbjs"
    }
};


var configs = [
    config('subschema.js', null, false, true),

    config('subschema-noreact.js',
        [externs], false, true
    ),
    config('subschema-server.js',
        [externs], true, true
    )
];
module.exports = configs;