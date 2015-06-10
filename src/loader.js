var tu = require('./tutils'), concat = Function.apply.bind(Array.prototype.concat, []),
    loaders = [],
    types = {load, list, add},
    api = {
        /**
         * @param template String - looks for a template named something.
         */

        addTemplate: add('Template'),
        loadTemplate: load('Template'),
        listTemplates: list('Template'),

        addType: add('Type'),
        loadType: load('Type'),
        listTypes: list('Type'),

        addSchema: add('Schema'),
        loadSchema: load('Schema'),
        listSchemas: list('Schema'),

        addValidator: add('Validator'),
        loadValidator: load('Validator'),
        listValidators: list('Validator'),

        addProcessor: add('Processor'),
        loadProcessor: load('Processor'),
        listProcessors: list('Processor'),

        addLoader(loader){
            if (tu.isArray(loader)) {
                return loader.map(function (v) {
                    return this.addLoader(v);
                }, this)
            }
            Object.keys(loader).forEach(function (key) {
                if (!(key in this)) {
                    var parts = /^(load|list)(.*)/.exec(key);
                    if (parts && parts.length > 2 && parts[1] in types) {
                        this[key] = types[parts[1]](parts[2]);
                    } else {
                        console.log('do not understand ' + key);
                    }
                }
            }, this);

            loaders.unshift(loader);
            return loader;
        },
        removeLoader(loader){
            var idx = loaders.indexOf(loader);
            if (0 > idx) {
                return;
            }
            var ret = loaders.splice(idx, 1)[0];
            if (ret && ret && ret.removeLoader) {
                ret.removeLoader();
            }
            return ret;
        },

        clearLoaders(){
            var ret = loaders.concat();
            loaders.length = 0;
            return ret;
        }
    };


function list(method) {
    var type = 'list' + method + 's';
    return function loader$list() {
        return concat(loaders.filter(function (v) {
            return typeof v[type] === 'function'
        }).map(function (v) {
            return v[type]();
        }));
    }
}
function load(method) {
    method = 'load' + method;
    return function load$load(load) {
        var i = 0, l = loaders.length, ret = null, scope;
        for (; i < l; i++) {
            var ret = loaders[i][method] && loaders[i][method].apply(this, arguments);
            if (ret != null) {
                return ret;
            }
        }
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