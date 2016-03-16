import PropTypes from './PropTypes';
import {isArray,toArray,isFunction, isString, isRegExp} from './tutils';
import warning from './warning';

const concat = Function.apply.bind(Array.prototype.concat, []);

export default function loaderFactory(loaders = []) {
    const types = {load, list, add},
        api = {

            addLoader(loader){
                if (isArray(loader)) {
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
            },
            loaderType
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
            if (isString(key)) {
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
    function loaderType(name, addF = add, loadF = load, listF = list) {
        if (addF) {
            this[`add${name}`] = addF(name);
        }
        if (loadF) {
            this[`load${name}`] = loadF(name);
        }
        if (listF) {
            this[`list${name}s`] = listF(name);
        }
        return this;
    }
    ['Operator', 'Template', 'Processor', 'Type', 'Schema', 'Validator', 'Style', 'Transition'].forEach(v => api::loaderType(v));
    return api;
}
