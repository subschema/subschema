var tu = require('./tutils'), concat = Function.apply.bind(Array.prototype.concat), loaders = [],
    api = {
        /**
         * @param template String - looks for a template named something.
         */
        loadTemplate: load('loadTemplate'),
        loadType: load('loadType'),
        loadSchema: load('loadSchema'),
        listTemplates(){
            return concat(loaders.filter(function (v) {
                return v.loadTemplate != null
            }).map(function (v) {
                return v.listTemplates();
            }));
        },
        listTypes(){
            return concat(loaders.filter(function (v) {
                return v.loadType != null
            }).map(function (v) {
                return v.listTypes();
            }));
        },
        listSchemas(){
            return concat(loaders.filter(function (v) {
                return v.loadSchema != null
            }).map(function (v) {
                return v.listSchemas();
            }));
        },
        addSchema: add('Schema'),
        addTemplate: add('Template'),
        addType: add('Type'),
        addLoader(loader){
            loaders.unshift(loader);
            return api;
        },
        clearLoaders(){
            var ret = loaders.concat();
            loaders.length = 0;
            return ret;
        }
    };


api.addLoader({
    loadTemplate: function (template) {
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
    loadType: function (type) {
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
    }
});
function load(method) {
    return function load$load() {
        var i = 0, l = loaders.length, ret = null;
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
        return api;
    }
}
module.exports = api;