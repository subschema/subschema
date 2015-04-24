var tu = require('./tutils'), concat = Function.apply.bind(Array.prototype.concat, []),
    loaders = [],
    api = {
        /**
         * @param template String - looks for a template named something.
         */
        loadTemplate: load('Template'),
        loadType: load('Type'),
        loadSchema: load('Schema'),
        loadValidator: load('Validator'),
        loadProcessor: load('Processor'),
        listTemplates: list('Templates'),
        listTypes: list('Type'),
        listSchemas: list('Schema'),
        listValidators: list('Validator'),
        addSchema: add('Schema'),
        addTemplate: add('Template'),
        addType: add('Type'),
        addValidator: add('Validator'),
        addProcessor: add('Processor'),
        listProcessors: list('Processor'),
        addLoader(loader){
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