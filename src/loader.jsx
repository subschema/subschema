var tu = require('./tutils'), concat = Function.apply.bind(Array.prototype.concat),
    loaders = [],
    api = {
        /**
         * @param template String - looks for a template named something.
         */
        loadTemplate: load('loadTemplate'),
        loadType: load('loadType'),
        loadSchema: load('loadSchema'),
        loadValidator: load('loadValidator'),
        listTemplates: list('Templates'),
        listTypes: list('Type'),
        listSchemas: list('Schema'),
        listValidators: list('Validator'),
        addSchema: add('Schema'),
        addTemplate: add('Template'),
        addType: add('Type'),
        addValidator: add('Validator'),
        addLoader(loader){
            loaders.unshift(loader);
            return api;
        },
        removeLoader(loader){
            var idx = loaders.indexOf(loader);
            if (0 > idx) {
                return;
            }
            return loaders.splice(idx, 1)[0];
        },

        clearLoaders(){
            var ret = loaders.concat();
            loaders.length = 0;
            return ret;
        }
    };


api.addLoader({
    loadTemplate (template) {
        return require.context("./templates", true, /^\.\/.*\.js(x)?/)('./' + template + '.jsx');
    },
    listTemplates(){
        return require.context("./templates", true, /^\.\/.*Template\.js(x)?/).keys().map(function (k) {
            return {
                name: k.replace(/.*\/(.*)\.js(x?)/, '$1'),
                path: k
            }
        });
    },
    loadType (type) {
        return require.context("./types", true, /^\.\/.*\.js(x)?/)('./' + type + '.jsx');
    },
    listTypes(){
        return require.context("./types", true, /^\.\/.*\.js(x)?/).keys().map(function (k) {
            return {
                name: k.replace(/.*\/(.*)\.js(x?)/, '$1'),
                path: k
            }
        }).filter(function (v) {
            return /Mixin$/.test(v.name);
        });
    },
    loadValidator(validator){
        var validators = require('./validators');
        return validators[validator] && validators[validator].bind(validators);
    },
    listValidators(){
        var validators = require('./validators');
        return Object.keys(validators).map(function (name) {
            var validator = validators[name];
            return {
                name, validator
            };
        });
    }
});

function list(method) {
    var type = 'list' + method + 's';
    return concat(loaders.filter(function (v) {
        return typeof v[type] === 'function'
    }).map(function (v) {
        return v[type]();
    }));
}
function load(method) {
    return function load$load(load) {
        var i = 0, l = loaders.length, ret = null;
        for (; i < l; i++) {
            var ret = loaders[i][method] && loaders[i][method].apply(this, arguments);
            if (ret != null) {
                return ret;
            }
        }

        // return require(load);
    }

}
function add(type) {
    var listKey = 'list' + type + 's', loadKey = 'load' + type, lcType = type.toLowerCase();
    return function loader$add(key, value) {
        var map, _api = {};
        if (tu.isString(key)) {
            map = {};
            map[key] = value;
        } else {
            map = key;
        }
        _api[listKey] = function () {
            return Object.keys(map).map(function (name) {
                var ret = {name};
                ret[lcType] = map[name];
                return ret;
            });
        };
        _api[loadKey] = function (name) {
            return map[name];
        };
        api.addLoader(_api);
        return _api;
    }
}
module.exports = api;