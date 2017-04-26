///(?!.*(index).js$).*\.js(x)
//var ctx = require.context('./', false, /(?!.*-setup\.jsx?$)\.jsx?/);
var jctx = require.context('./', false, /^(?!.*-setup|index\.js$).*\.jsx?$/);
var rctx = require.context('!!raw-loader!./', false, /-setup\.jsx?$/);
var fctx = require.context(`raw-loader!./`, false, /-setup\.jsx?$/);
var keysRctx = rctx.keys();
var keys = jctx.keys();
var __default = keys.reduce(function (obj, key) {

    if (/(index|-setup|context)/.test(key)) {
        return obj;
    }
    var setup = obj[key.replace(/\.jsx?$/, '').replace(/.*\//, '')] = jctx(key);
    const setupFile = key.replace(/(\.js)$/, '-setup.js');
    if (keysRctx.indexOf(setupFile) > -1) {
        setup.setupFile = setupFile;
        setup.setupTxt = rctx(setupFile);

        setup.setupFunc = new Function(['require', 'schema'],`var React = require('react');\n${fctx(setupFile)}`);
    }
    return obj;
}, {});

module.exports = __default;// {__esModule: true, default: __default};