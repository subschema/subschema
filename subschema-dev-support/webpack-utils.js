var path           = require('path');
var SUBSCHEMA_CONF = 'subschema-webpack.config.js';
var fs             = require('fs');

var asArray = Function.call.bind(Array.prototype.slice);
function project() {
    return path.resolve(cwd(), path.join.apply(path, asArray(arguments)));
}
function cwd() {
    return path.resolve.apply(path,
        [process.env.SUBSCHEMA_PROJECT_DIR || process.cwd()].concat(
            asArray(arguments)));
}
function pkg() {
    var _pkg = cwd('package.json');
    debug(`using package`, _pkg);
    return require(_pkg);
}
function dependency(current) {
    if (current == pkg().name) {
        //if its the current project than we return relative to ourselves
        return project.apply(null, asArray(arguments, 1));
    }
    const local = path.resolve.apply(path,
        [cwd()].concat(asArray(arguments)));
    if (fs.existsSync(local)) {
        return local;
    }
    return path.resolve.apply(path,
        [cwd(), 'node_modules'].concat(asArray(arguments)));
}
function re(str) {
    if (str.startsWith('!')) {
        str = str.substring(1);
    }
    if (str.startsWith('/') && str.endsWith('/')) {
        return str.substring(1,
            str.length - 1);
    }
    if (!str.startsWith('/')) {
        str = '^' + str;
    }
    if (!str.endsWith('/')) {
        str = str + '$';
    }
    return str;
}
function execThis(func) {
    return func(this);
}
function wrapExcludes(excludes = []) {
    excludes = excludes ? Array.isArray(excludes) ? excludes : [excludes] : [];
    excludes = excludes.map(function (str) {
        var isNegate = str.startsWith('!');
        var _re      = new RegExp(re(str));
        return function (v) {
            var ret = isNegate ? !_re.test(v) : _re.test(v);
            return ret;
        }
    });
    return function (value) {
        return excludes.find(execThis, value);
    }
}
var DEFAULT_EXCLUDE = 'subschema(?:$|-(?:native|core|loader|project|component|processors|transitions|css|validators)(?:-.+?)?)';

function keys$unique(ret, key) {
    ret[key] = true;
    return ret;
}
function keys(obj) {
    if (arguments.length == 0) {
        return [];
    }
    if (arguments.length == 1) {
        return Object.keys(obj);
    }
    var ret = {};
    for (var i = 0, l = arguments.length; i < l; i++) {
        var c = arguments[i];
        if (c) {
            Object.keys(c).reduce(keys$unique, ret);
        }
    }
    return Object.keys(ret);
}
function unique(arr) {
    var ret = {};
    for (var i = 0, l = arguments.length; i < l; i++) {
        arguments[i] && arguments[i].reduce(keys$unique, ret);
    }
    return Object.keys(ret);
}

function hasSource(name) {
    return fs.existsSync(dependency(name, 'src'));
}
function debug() {
    if (process.env.SUBSCHEMA_DEBUG) {
        console.warn.apply(console, asArray(arguments));
    }
}
function warn() {
    console.warn.apply(console, asArray(arguments));
}
function info() {
    console.warn.apply(console, asArray(arguments));
}
function concatFilteredDependencies(core, userPkg = pkg()) {
    return unique(filteredDependencies(core), filteredDependencies(userPkg));
}
function filteredDependencies(userPkg = pkg()) {
    var subschema = userPkg.subschema;
    var include   = subschema && subschema.include;
    var exclude   = subschema && subschema.exclude;
    if (include) {
        include = Array.isArray(include) ? include : [include];
    }
    if (exclude) {
        exclude = Array.isArray(exclude) ? exclude : [exclude];
    }
    return _filteredDependencies(userPkg, include, exclude);
}
function aliasDependencies(userPkg = pkg()) {
    return _filteredDependencies(userPkg, [], [DEFAULT_EXCLUDE]);
}
function _filteredDependencies(userPkg  = pkg(), includes,
                               excludes = [DEFAULT_EXCLUDE]) {

    var all = [userPkg.name].concat(
        keys(userPkg.dependencies, userPkg.devDependencies,
            userPkg.peerDependencies));
    if (!all) {
        return [];
    }
    var isExclude        = wrapExcludes(excludes);
    var isInclude        = includes ? wrapExcludes(includes) : () => false;
    var filteredExcludes = all.filter(isExclude);
    var filteredIncludes = all.filter(isInclude);
    var ret              = unique(filteredExcludes, filteredIncludes);

    return !ret ? [] : ret;

}

var pkg;
var packageJSON = function () {
    return require(project('package.json'))
};

function wrapFunc(f) {
    if (!f) {
        return;
    }
    return function (opts, conf) {
        return f.call(this, opts, conf) || conf;
    }
}

function set(obj, key, value) {
    const keys = key.split('.');
    const last = keys.pop();
    let cobj   = obj || {};
    while (keys.length) {
        const c = keys.shift();
        cobj    = cobj[c] || (cobj[c] = {});
    }
    obj[last] = value;
    return obj;
}


function applyFuncs(f1, f2) {
    f1 = f1 && (f1.default ? f1.default : f1);
    f2 = f2 && (f2.default ? f2.default : f2);
    if (!f2) {
        return wrapFunc(f1);
    }
    if (!f1 && f2) {
        return wrapFunc(f2);
    }
    if (!f1 && !f2) {
        return null;
    }
    f1 = wrapFunc(f1);
    f2 = wrapFunc(f2);
    return function (opts, conf) {
        //keep scope.
        return f1.call(this, opts, (f2.call(this, opts, conf)));
    }
}
function parseAlias(key) {
    var parts = key.split('=', 2);
    var name  = parts[0];
    if (parts[1]) {
        this[name] = parts[1];
    } else if (fs.existsSync(project(name, 'package.json'))) {
        this[name] = project(name);
    } else {
        this[name] = project('node_modules', name);
    }
}
function useAlias(alias = {}) {

    if (process.env.SUBSCHEMA_USE_ALIASES) {

        process.env.SUBSCHEMA_USE_ALIASES.split(/,\s*/)
               .forEach(parseAlias, alias);
    }
    if (process.env.SUBSCHEA_DEBUG) {
        console.warn('using aliases', alias);
    }
    return alias;
}
function useExternalizePeers(externals = {}) {

    if (process.env.SUBSCHEMA_EXTERNALIZE_PEERS) {
        var localPkg = project('package.json');
        var peers    = require(localPkg).peerDependencies;
        if (!peers) {
            console.warn(
                `using --externalize-peers however there are no peerDependencies in ${localPkg}`);
        } else {
            Object.keys(peers).reduce(function (ret, key) {
                if (!(key in ret)) {
                    ret[key] = key;
                }
                return ret;
            }, externals);
        }
    }
    return externals;
}
function useExternals(externals = {}) {
    if (process.env.SUBSCHEMA_USE_EXTERNALS) {
        return process.env.SUBSCHEMA_USE_EXTERNALS.split(/,\s*/)
                      .reduce(function (ret, key) {
                          const [k, v] = key.split(/\s*=\s*/, 2);
                          set(ret, k, v || k);
                          return ret;
                      }, externals);
    }
}
function useCustomConf(customConf, confFile = SUBSCHEMA_CONF, deps = pkg()) {
    aliasDependencies(deps).forEach(function (key) {
        if (fs.existsSync(dependency(key, confFile))) {
            customConf =
                applyFuncs(customConf, require(dependency(key, confFile)));
            debug(`using custom config for ${key}`);
        } else {
            var resolvedTo;
            try {
                resolvedTo = require.resolve(`${key}/${confFile}`);
            } catch (e) {
                //swallow it probably does not exists.
            }
            if (resolvedTo) {
                //don't swallow. because it does exist but theres a problem;
                customConf = applyFuncs(customConf, require(resolvedTo));
                debug(`using custom config for ${key}`);

            }
        }
    });
    return customConf;
}
function useDepAlias(alias = {}, deps = pkg()) {
    var aliasArr = [];

    if (process.env.SUBSCHEMA_NO_DEPENDENCY_ALIASES) {
        return alias;
    }
    if (!process.env.SUBSCHEMA_DEPENDENCY_ALIASES) {
        aliasArr = aliasDependencies(deps);
    } else {
        aliasArr = unique([deps.name],
            process.env.SUBSCHEMA_DEPENDENCY_ALIASES.split(/,\s*/));
    }
    const r = aliasArr.filter(hasSource).reduce(function (ret, key) {
        ret[key + '/lib/style.css'] = dependency(key, 'lib', 'style.css');
        ret[key]                    =
            ret[key + '/lib'] = dependency(key, 'src');
        if (process.env.SUBSCHEMA_KARMA) {
            ret[key + '/test'] = dependency(key, 'test');
            ret[key + '/']     = dependency(key, 'src');

        }
        return ret;
    }, alias);
    console.log('env %O', r);
    return r;
}

module.exports = {
    set,
    wrapFunc,
    project,
    deps: pkg(),
    pkg,
    applyFuncs,
    useAlias,
    useDepAlias,
    useCustomConf,
    useExternals,
    useExternalizePeers,
    filteredDependencies,
    dependency,
    debug,
    warn,
    concatFilteredDependencies,
    info,
    cwd
};
