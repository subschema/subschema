var camelCase = require('lodash/camelCase');
var pkg = require('../package.json');
var path = require('path');
var EMPTY = {};
function re(str) {
    if (str.startsWith('!')) str = str.substring(1);
    if (str.startsWith('/') && str.endsWith('/'))return str.substring(1, str.length - 1);
    if (!str.startsWith('/')) str = '^' + str;
    if (!str.endsWith('/')) str = str + '$';
    return str;
}

function wrapExcludes(excludes = []) {
    excludes = excludes.map(function (str) {
        var isNegate = str.startsWith('!');
        var _re = new RegExp(re(str));
        return function (v) {
            return isNegate ? _re.test(v) : !_re.test(v);
        }
    });
    return function (value) {
        return excludes.find(c => c(value));
    }
}

function writeImport(cmd) {
    return `import ${camelCase(cmd)} from '${cmd}'`
}

function writeLoader(cmd) {
    return `loader.addLoader(${camelCase(cmd)})`
}
function unique$inner(ret, key) {
    ret[key] = true;
    return ret;
}
function unique(keys) {
    return Object.keys(keys.reduce(unique$inner, {}));
}

const DEFAULT_EXCLUDE = ['!subschema-(?:component|processors|transitions|css|validators)(?:-.+?)?'];

module.exports = function (options = {}) {
    const userPkg = options.package || {};

    const {include = [], exclude} = userPkg.subschema || {exclude: DEFAULT_EXCLUDE};

    const isExclude = wrapExcludes(exclude);

    const all = [userPkg.name].concat(
        Object.keys(pkg.devDependencies || EMPTY),
        Object.keys(pkg.peerDependencies || EMPTY),
        Object.keys(pkg.dependencies || EMPTY),
        Object.keys(userPkg.devDependencies || EMPTY),
        Object.keys(userPkg.peerDependencies || EMPTY),
        Object.keys(userPkg.dependencies || EMPTY)
    );

    const deps = unique(all.filter(isExclude).concat(include));

    let code = `
import loaderFactory from 'subschema-loader';

//Automagically imported
${deps.map(writeImport).join(';\n')} 

const loader = loaderFactory();
//Automagically added to importer
${deps.map(writeLoader).join(';\n')} 

//Your Welcome.
export default loader;
    `;

    let dependencies = [];
    if (options.packagePath) {
        dependencies.concat(options.packagePath);
    }

    dependencies.push(path.resolve(__dirname, '..', 'package.json'));

    return {
        code,
        dependencies,
        cacheable: true
    }

};