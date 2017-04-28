import {isArray, isString} from 'subschema-utils';
import warning from 'subschema-utils/lib/warning';

const concat = Function.apply.bind(Array.prototype.concat, []);

const upFirst = (str) => `${str[0].toUpperCase()}${str.substring(1)}`;
const addResolver = function () {
    const map = [];

    const _api = {
        listResolvers (){
            return map.map(function ([propType, resolver]) {
                return {propType, resolver};
            });
        },
        loadResolver(_propType){
            if (_propType == null) return;
            for (let i = 0, l = map.length; i < l; i++) {
                const c = map[i];
                if (c[0] === _propType) {
                    return c[1];
                }
            }
        }
    };
    Object.assign(this, _api);
    return function loader$addResolver(propType, resolver) {
        if (!propType) return;
        if (Array.isArray(propType) && !resolver) {
            return loader$addResolver.call(this, propType[0], propType[1]);
        }
        const pType = typeof propType, rType = typeof resolver;
        if (pType === 'function' && rType === 'function') {
            map[map.length] = [propType, resolver];
        } else if (pType === 'object' && rType === 'object') {
            Object.keys(propType).forEach(function (key) {
                if (propType[key] && resolver[key]) {
                    map[map.length] = [propType[key], resolver[key]];
                }
            });
        }
        this.addLoader(_api);
        return _api;
    }
};

export const LOADER_TYPES = [['Resolver', addResolver, null, null], 'Operator', 'Template', 'Processor', 'Type', 'Schema', 'Validator', 'Style', 'Transition'];

export const WarningLoader = LOADER_TYPES.reduce(function (ret, key) {
    if (Array.isArray(key)) {
        key = key[0];
    }
    ret[`load${upFirst(key)}`] = function (type) {
        warning(false, 'unable to find "%s" named "%s', key, type);
    };
    return ret;
}, {});
export default function loaderFactory(loaders = []) {
    const types = {load, list, add},
        api = {

            addLoader(loader){
                if (loader == null) return loader;
                if (isArray(loader)) {
                    return loader.map(function (v) {
                        return this.addLoader(v);
                    }, this)
                }
                Object.keys(loader).forEach(function (key) {
                    const parts = /^(load)(.+?)$/.exec(key);
                    if (key in this && parts && parts.length > 2 && parts[1] in types) {
                        this[key] = types[parts[1]](parts[2]);
                    } else {
                        //allow for an array of objects to be loaded.
                        const _add = this[`add${upFirst(key)}`];
                        if (typeof _add === 'function') {
                            _add.call(api, loader[key]);
                            //  warning(false, 'do not understand "%s"', key);
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
            var i = 0, l = loaders.length, ret = null;
            for (; i < l; i++) {
                ret = loaders[i][method] && loaders[i][method].apply(this, arguments);
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
            warning(key, `key can not be null`);
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
            this[`add${name}s`] = this[`add${name}`] = this::addF(name);
        }
        if (loadF) {
            this[`load${name}`] = this::loadF(name);
        }
        if (listF) {
            this[`list${name}s`] = this::listF(name);
        }
        return this;
    }

    LOADER_TYPES.forEach(v => {
        if (Array.isArray(v)) api::loaderType(...v);
        else api::loaderType(v)
    });


    return api;
}
