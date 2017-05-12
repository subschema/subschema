var path = require('path');
var babelrc = require('subschema-dev-support/babelrc.json');
var babelProcess = require('subschema-dev-support/babel-process');
var webpackUtils = require('subschema-dev-support/webpack-utils');
var useDepAlias = webpackUtils.useDepAlias, useAlias = webpackUtils.useAlias,
    cwd = webpackUtils.cwd,
    debug = webpackUtils.debug,
    useCustomConf = webpackUtils.useCustomConf,
    pkg = webpackUtils.pkg;

function filterReact(preset) {
    return preset != 'react';
}

function setupBabel(haulBabel) {
    var copy = Object.assign({}, babelrc);

    copy.presets = copy.presets.filter(filterReact).concat(haulBabel.presets);
    copy.plugins = haulBabel.plugins.concat(copy.plugins);

    var babel = Object.assign({}, babelProcess(copy, function (p) {
        if (p.startsWith('/')) return p;
        return path.join(__dirname, 'node_modules', p);
    }));

    delete babel.ignore;
    babel.cacheDirectory = true;
    return babel

}
module.exports = function (obj, defaults) {

    var ret = {
        resolve: Object.assign({}, defaults.resolve, {
            extensions: [
                `.${obj.platform}.js`,
                `.${obj.platform}.jsx`,
                ".native.js",
                ".native.jsx",
                ".js",
                ".jsx"
            ],
            alias: useDepAlias(useAlias(Object.assign({}, defaults.resolve.alias)))
        }),
        entry: cwd(`./index.${obj.platform}.js`)
    };

    for (var i = 0, l = defaults.module.rules.length; i < l; i++) {
        var rule = defaults.module.rules[i];
        if (rule.use && rule.use.query && rule.use.query.id == 'babel') {
            rule.test = /\.jsx?$/;
            break;
        }
    }
    for (var i = 0, l = defaults.plugins.length; i < l; i++) {
        var plugin = defaults.plugins[i];
        if (plugin && plugin.id === 'babel') {
            plugin.config.loaders[0].query = setupBabel(plugin.config.loaders[0].query);
            break;
        }
    }
    var customConf = useCustomConf(null, 'subschema-haul.config.js');
    if (customConf) {
        ret = customConf(obj, ret);
    }
    debug(`Haul Config ${obj.platform}`, JSON.stringify(ret, null, 2));
    return ret;

};