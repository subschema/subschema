var tu = require('./tutils'), concat = Function.apply.bind(Array.prototype.concat, []);
var PropTypes = require('./PropTypes');
var warning = require('./warning');
var {isArray,toArray,isFunction, isString, isRegExp} = tu;

module.exports = function loaderFactory(loaders) {
    loaders = loaders || [];
    var types = {load, list, add},
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

            addOperator: add('Operator'),
            loadOperator: load('Operator'),
            listOperators: list('Operator'),

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

    function initValidators(v) {
        if (isString(v)) {
            if (v[0] === '/' && v[v.length - 1] === '/') {
                v = new RegExp(v);
            } else {
                var validator = this.loadValidator(v);
                warning(validator, 'Validator was not found for "%s"', v);
                return this.loadValidator(v)();
            }
        }
        //If it is a RegExp than init ReExp
        if (isRegExp(v)) {
            return this.loadValidator('regexp')({
                regexp: v
            });
        }

        //If it has a type init it
        if (v.type) {
            var validator = this.loadValidator(v.type);
            return validator(v);
        }

        //If its a function just return it.
        if (isFunction(v)) {
            return v;
        }
        //otherwise lets try initing it.
        return this.loadValidator(v)();
    }

    function toLabelVal(v) {
        if (isString(v)) {
            return {
                label: v,
                val: v
            }
        }
        return v;
    }

    api.loadByPropType = (function () {
        var {operator, options, processor, schema, template,  type,  validator, validators} = PropTypes;
        var properator = operator.isRequired,
            proptions = options.isRequired,
            prprocessor = processor.isRequired,
            prschema = schema.isRequired,
            prtemplate = template.isRequired,
            prtype = type.isRequired,
            prvalidator = validator.isRequired,
            prvalidators = validators.isRequired;


        return function loadByPropType(propType, value) {
            var ret = null;

            if (options === propType || proptions === propType) {
                ret = toArray(value).map(toLabelVal);
            } else if (template === propType || prtemplate === propType) {
                ret = this.loadTemplate(value)
            } else if (schema === propType || prschema === propType) {
                ret = this.loadSchema(value);
            } else if (type === propType || prtype === propType) {
                ret = this.loadType(value);
            } else if (processor === propType || prprocessor === propType) {
                ret = this.loadProcessor(value);
            } else  if (operator === propType || properator === propType) {
                ret = this.loadOperator(value);
            } else if (validator === propType || prvalidator === propType) {
                ret = initValidators.call(this, value);
            } else if (validators === propType || prvalidators === propType) {
                ret = toArray(value).map(initValidators, this);
            }
            return (ret == null) ? value : ret;
        }
    }());
    return api;
}
