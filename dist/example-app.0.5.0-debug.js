define("Subschema", ["React","_"], function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ((function(modules) {
	// Check all modules for deduplicated modules
	for(var i in modules) {
		if(Object.prototype.hasOwnProperty.call(modules, i)) {
			switch(typeof modules[i]) {
			case "number":
				// Module is a copy of another module
				modules[i] = modules[modules[i]];
				break;
			case "object":
				// Module can be created from a template
				modules[i] = (function(_m) {
					var args = _m.slice(1), fn = modules[_m[0]];
					return function (a,b,c) {
						fn.apply(null, [a,b,c].concat(args));
					};
				}(modules[i]));
			}
		}
	}
	return modules;
}([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	//Subschema
	var Form = __webpack_require__(5);
	var tu = __webpack_require__(6);
	var ValueManager = __webpack_require__(7);
	
	//Everything else.
	var React = __webpack_require__(1);
	var Alert = __webpack_require__(26);
	var Modal = __webpack_require__(27);
	var ModalTrigger = __webpack_require__(28);
	var Button = __webpack_require__(29);
	
	var _ = __webpack_require__(2);
	__webpack_require__(30);
	
	var setupRe = /^function [^{]*\{([\s\S]*)\}$/;
	var MyModal = React.createClass({
	    displayName: 'MyModal',
	
	    render: function render() {
	        var _this = this;
	
	        return React.createElement(
	            Modal,
	            _extends({}, this.props, { bsStyle: 'primary', title: 'Submit', animation: true }),
	            React.createElement(
	                'div',
	                { className: 'modal-body' },
	                this.props.errors ? React.createElement(
	                    'h3',
	                    null,
	                    'Errors'
	                ) : null,
	                this.props.errors && Object.keys(this.props.errors).map(function (key) {
	                    return React.createElement(
	                        'div',
	                        null,
	                        React.createElement(
	                            'h4',
	                            null,
	                            key
	                        ),
	                        React.createElement(
	                            'ul',
	                            null,
	                            _this.props.errors[key].map(function (v) {
	                                return React.createElement(
	                                    'li',
	                                    null,
	                                    v
	                                );
	                            })
	                        )
	                    );
	                }),
	                React.createElement(
	                    'div',
	                    null,
	                    React.createElement(
	                        'h2',
	                        null,
	                        'Values'
	                    ),
	                    React.createElement(
	                        'pre',
	                        null,
	                        JSON.stringify(this.props.value, void 0, 2),
	                        '}'
	                    )
	                )
	            ),
	            React.createElement(
	                'div',
	                { className: 'modal-footer' },
	                React.createElement(
	                    Button,
	                    { onClick: this.props.onRequestHide },
	                    'Close'
	                )
	            )
	        );
	    }
	});
	var samples = __webpack_require__(3).keys().map(function (v) {
	    return {
	        name: v.replace(/\.\/(.*)\.js(x)?/, '$1'),
	        file: v.replace('./', '')
	    };
	});
	
	var App = React.createClass({
	    displayName: 'App',
	
	    getInitialState: function getInitialState() {
	        return {
	            loadErrors: false,
	            loadData: false,
	            data: null,
	            errors: {},
	            file: 'Autocomplete.js',
	            description: ''
	        };
	    },
	    componentWillMount: function componentWillMount() {
	        var _this2 = this;
	
	        var vm = this.vm = new ValueManager();
	        vm.addListener(null, function (data) {
	            _this2.setState({
	                data: data
	            });
	        });
	        this.loadFile();
	    },
	
	    changeFile: function changeFile(e) {
	        this.state.file = e.target.value;
	        this.loadFile();
	    },
	    loadFile: function loadFile() {
	        if (this.state.content && this.state.content.teardown) {
	            this.state.content.teardown();
	        }
	        var json = this.state.file !== 'none' ? __webpack_require__(4)("./" + this.state.file) : { schema: {} };
	        json.output = null;
	        var state = {
	            loadErrors: this.state.loadErrors,
	            loadData: this.state.loadData,
	            file: this.state.file,
	            content: json,
	            data: this.state.loadData ? json.data : {},
	            errors: this.state.loadErrors ? json.errors : {}
	        };
	        if (json.setup) {
	            state._setup = json.setup();
	        }
	        this.setState(state);
	    },
	
	    handleData: function handleData(e) {
	        var data = {};
	        if (this.state.loadData = e.target.checked) {
	            data = this.state.content.data;
	        }
	
	        this.vm.setValue(data);
	    },
	    handleError: function handleError(e) {
	        var load = this.state.loadErrors = e.target.checked;
	        var errors = load ? this.state.content.errors : {};
	        this.vm.setErrors(errors);
	        this.setState({ errors: errors });
	    },
	    handleSubmit: function handleSubmit(e, errors, value) {
	        e && e.preventDefault();
	        this.setState({
	            alert: true,
	            submitErrors: errors,
	            submitValue: value
	        });
	    },
	
	    hideModal: function hideModal(e, errors, value) {
	        this.setState({
	            alert: false,
	            submitErrors: null,
	            submitValue: null
	
	        });
	    },
	
	    render: function render() {
	        var _state = this.state;
	        var content = _state.content;
	        var data = _state.data;
	        var errors = _state.errors;
	
	        var _ref = content || {};
	
	        var schema = _ref.schema;
	        var description = _ref.description;
	        var title = _ref.title;
	        var setup = _ref.setup;
	        var props = _ref.props;
	        var teardown = _ref.teardown;
	
	        if (setup) {
	            var tmp = setup.toString().replace(setupRe, '$1').replace(/__webpack_require__\(\d+?\)/g, 'require("subschema")').split('\n').map(function (v) {
	                return v.replace(/^	        /, '');
	            });
	            // tmp.pop();
	            // tmp.pop();
	            setup = tmp.join('\n');
	        }
	        title = title || this.state.file.replace(/\.js(x)?/, '');
	        var propsstr = '';
	        Object.keys(props || {}).forEach(function (key) {
	            propsstr += key + '={' + JSON.stringify(props[key]) + '} ';
	        });
	        return React.createElement(
	            'div',
	            null,
	            React.createElement(
	                'div',
	                { className: 'navbar' },
	                React.createElement(
	                    'div',
	                    { className: 'navbar-inner' },
	                    React.createElement(
	                        'div',
	                        { className: 'form-inline' },
	                        React.createElement(
	                            'select',
	                            { className: 'form-control', ref: 'selector', onChange: this.changeFile,
	                                value: this.state.file },
	                            React.createElement(
	                                'option',
	                                { value: 'none' },
	                                'None Selected'
	                            ),
	                            samples.map(function (v) {
	                                return React.createElement(
	                                    'option',
	                                    { key: v.name, value: v.file },
	                                    v.name
	                                );
	                            })
	                        ),
	                        React.createElement(
	                            'label',
	                            { className: 'checkbox-inline' },
	                            React.createElement('input', { type: 'checkbox', onChange: this.handleData }),
	                            ' Load Data'
	                        ),
	                        React.createElement(
	                            'label',
	                            { className: 'checkbox-inline' },
	                            React.createElement('input', { type: 'checkbox', onChange: this.handleError }),
	                            ' Load Errors'
	                        )
	                    )
	                )
	            ),
	            React.createElement(
	                'div',
	                { className: 'container-fluid' },
	                React.createElement(
	                    'div',
	                    { className: 'row-fluid' },
	                    React.createElement(
	                        'fieldset',
	                        null,
	                        React.createElement(
	                            'legend',
	                            null,
	                            'Example - ',
	                            title
	                        ),
	                        React.createElement('p', { dangerouslySetInnerHTML: { __html: description || '' } }),
	                        React.createElement(
	                            'div',
	                            { className: 'span10' },
	                            React.createElement(
	                                'div',
	                                { className: 'container-fluid' },
	                                React.createElement(
	                                    'div',
	                                    { className: 'row-fluid' },
	                                    React.createElement(
	                                        'div',
	                                        { className: 'span12' },
	                                        React.createElement(Form, _extends({ ref: 'form', schema: schema, value: data,
	                                            errors: errors,
	                                            valueManager: this.vm,
	                                            onSubmit: this.handleSubmit,
	                                            onValidate: this.handleErrors
	                                        }, props))
	                                    )
	                                ),
	                                React.createElement(
	                                    'pre',
	                                    null,
	                                    React.createElement(
	                                        'div',
	                                        null,
	                                        'var Form = require(\'subschema\').Form;'
	                                    ),
	                                    React.createElement(
	                                        'div',
	                                        null,
	                                        'var React = require(\'react\');'
	                                    ),
	                                    setup ? React.createElement(
	                                        'div',
	                                        null,
	                                        setup
	                                    ) : null,
	                                    React.createElement(
	                                        'div',
	                                        null,
	                                        'var data = ',
	                                        JSON.stringify(data || {}, null, 2),
	                                        ';'
	                                    ),
	                                    React.createElement(
	                                        'div',
	                                        null,
	                                        'var errors = ',
	                                        JSON.stringify(errors || {}, null, 2),
	                                        ';'
	                                    ),
	                                    React.createElement(
	                                        'div',
	                                        null,
	                                        'var schema = ',
	                                        JSON.stringify(schema || {}, null, 2),
	                                        ';'
	                                    ),
	                                    'React.render(<Form value={data} schema={schema} errors={errors} ' + propsstr + '/>, document.getElementById("content"))'
	                                )
	                            )
	                        )
	                    )
	                ),
	                this.state.alert ? React.createElement(MyModal, { ref: 'modal', onRequestHide: this.hideModal, errors: this.state.submitErrors,
	                    value: this.state.submitValue }) : null
	            )
	        );
	    }
	
	});
	
	React.render(React.createElement(App, null), document.getElementsByTagName('body')[0]);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./All.jsx": 14,
		"./Autocomplete.js": 15,
		"./Basic.js": 16,
		"./Loader.jsx": 17,
		"./NestedForms.js": 18,
		"./Questionaire.js": 19,
		"./Todos.js": 20,
		"./Wizard.js": 21,
		"./checkboxes.js": 22,
		"./hidden.js": 23,
		"./login.js": 24,
		"./radio.js": 25
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 3;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./All.jsx": 14,
		"./Autocomplete": 15,
		"./Autocomplete.js": 15,
		"./Basic": 16,
		"./Basic.js": 16,
		"./Loader.jsx": 17,
		"./NestedForms": 18,
		"./NestedForms.js": 18,
		"./Questionaire": 19,
		"./Questionaire.js": 19,
		"./Todos": 20,
		"./Todos.js": 20,
		"./Wizard": 21,
		"./Wizard.js": 21,
		"./checkboxes": 22,
		"./checkboxes.js": 22,
		"./hidden": 23,
		"./hidden.js": 23,
		"./login": 24,
		"./login.js": 24,
		"./radio": 25,
		"./radio.js": 25
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 4;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };
	
	var React = __webpack_require__(1);
	var NestedMixin = __webpack_require__(9);
	var loader = __webpack_require__(12);
	var ValueManager = __webpack_require__(7);
	var Form = React.createClass({
	    displayName: 'Form',
	    mixins: [NestedMixin],
	    getDefaultProps: function getDefaultProps() {
	        return {
	            template: 'FormTemplate',
	            onSubmit: function onSubmit() {}
	        };
	    },
	
	    handleSubmit: function handleSubmit(e) {
	        e && e.preventDefault();
	        var vm = this.props.valueManager;
	        this.props.onSubmit(e, vm.getErrors(), vm.getValue());
	    },
	    setErrors: function setErrors(errors) {
	        this.props.valueManager.setErrors(errors);
	    },
	    render: function render() {
	        var _props = this.props;
	        var schema = _props.schema;
	        var subSchema = _props.subSchema;
	        var fields = _props.fields;
	        var submitButton = _props.submitButton;
	        var template = _props.template;
	
	        var props = _objectWithoutProperties(_props, ['schema', 'subSchema', 'fields', 'submitButton', 'template']);
	
	        schema = schema || subSchema;
	        schema = this.normalizeSchema(schema);
	        this.schema = schema.schema ? schema : { schema: schema, fields: fields };
	        var sb = submitButton || this.schema.submitButton;
	        var Template = loader.loadTemplate(template);
	        return React.createElement(
	            Template,
	            { onValidate: this.handleValidate, onSubmit: this.props.onSubmit, schema: this.schema,
	                valueManager: this.props.valueManager
	            },
	            this.schema && this.schema.schema ? this.renderSchema(this) : null,
	            sb ? React.createElement('button', { type: 'submit', className: 'btn btn-primary', dangerouslySetInnerHTML: { __html: sb } }) : null,
	            this.props.children
	        );
	    }
	
	});
	module.exports = Form;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var api = {
	    template: __webpack_require__(77),
	    extend: __webpack_require__(78),
	    isFunction: __webpack_require__(79),
	    isString: __webpack_require__(80),
	    isRegExp: __webpack_require__(81),
	    isDate: __webpack_require__(82),
	    isBoolean: __webpack_require__(83),
	    isArray: __webpack_require__(84),
	    isNumber: __webpack_require__(85),
	    find: __webpack_require__(86),
	    noop: function noop() {},
	    unique: function unique(array) {
	        return array.filter(function (a, b, c) {
	            // keeps first occurrence
	            return c.indexOf(a) === b;
	        });
	    },
	    values: function values(obj) {
	        return obj == null ? [] : this.isArray(obj) ? obj : Object.keys(obj).map(function (v, i) {
	            return obj[v];
	        });
	    },
	    path: function path() {
	        var args = api.slice(arguments),
	            l = args.length,
	            i = 0,
	            j = 0,
	            p;
	        var ret = '';
	        for (; i < l; i++) {
	            p = args[i];
	            if (p == null || p === '') continue;
	            ret += j++ === 0 ? p : '.' + p;
	        }
	        return ret;
	    },
	    flatten: Function.apply.bind(Array.prototype.concat, []),
	    toArray: function toArray(v) {
	        if (Array.isArray(v)) {
	            return v;
	        }
	        if (api.isString(v)) {
	            return v.split(/\,\s*/);
	        }
	        if (v == null) {
	            return [];
	        }
	        return [v];
	    },
	    xtend: function xtend(dest, args) {
	        dest = dest || {};
	        for (var i = 1, l = arguments.length; i < l; i++) {
	            var arg = arguments[1];
	            if (arg == null) continue;
	            for (var j in arg) {
	                dest[j] = args[j];
	            }
	        }
	        return dest;
	    },
	    slice: Function.call.bind(Array.prototype.slice),
	    clone: function clone(t) {
	        var tt = typeof t;
	        if (t == null || tt === 'number' || tt === 'string' || tt === 'function') {
	            return t;
	        }
	        if (t instanceof Date) {
	            return new Date(t.getTime());
	        }
	        if (Array.isArray(t)) {
	            return t.slice(0);
	        }
	        var ret = {};
	        Object.keys(t).forEach(function (v) {
	            ret[v] = t[v];
	        });
	        return ret;
	    },
	    debounce: function debounce(fn, to) {
	        var ti;
	
	        return function f() {
	            clearTimeout(ti);
	            var args = Array.prototype.slice.call(arguments),
	                self = this;
	            ti = setTimeout(function () {
	                fn.apply(self, args);
	            }, to);
	        };
	    },
	    nullCheck: function nullCheck(v) {
	        return v != null;
	    },
	    emptyCheck: function emptyCheck(v) {
	        return v != null && v.length > 0;
	    },
	    push: Function.apply.bind(Array.prototype.push)
	};
	module.exports = api;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var tu = __webpack_require__(6);
	
	function removeListener(listeners) {
	    return function ValueManager$removeListener(path, listener) {
	        var remove = listeners.slice(0);
	        if (path && !listener && !tu.isString(path)) {
	            path = listener;
	            listener = null;
	        }
	        if (path) {
	            remove = remove.filter(function (v) {
	                return v.path === path;
	            });
	        }
	        if (listener) {
	            //make the return of addListener also able to be used
	            //in remove listener.
	            remove = remove.filter(function (v) {
	                return v === listener || v.listener === listener;
	            });
	        }
	        return remove.map(function (r) {
	            var idx = this.indexOf(r);
	            if (idx > -1) {
	                return this.splice(idx, 1)[0];
	            }
	        }, listeners);
	    };
	}
	
	function addListener(listeners, find, findOld) {
	    return function ValueManager$addListener(path, listener, scope, init) {
	        if (tu.isFunction(path)) {
	            listener = path;
	            path = null;
	        }
	        if (listener == null) {
	            return;
	        }
	        var obj = { path: path, listener: listener, scope: scope };
	
	        init = init === true ? obj.listener : tu.isFunction(init) ? init : null;
	        if (init) {
	            init.call(obj.scope, find(path), findOld(path), path);
	        }
	        listeners.push(obj);
	        return obj;
	    };
	}
	function canDescend(obj) {
	    if (obj == null || tu.isNumber(obj) || tu.isBoolean(obj) || tu.isString(obj) || tu.isDate(obj) || tu.isArray(obj)) {
	        return false;
	    }
	    return true;
	}
	function copy(obj) {
	    return obj == null ? null : Array.isArray(obj) ? obj.slice(0) : tu.extend({}, obj);
	}
	
	function ValueManager(value, errors) {
	    if (!(this instanceof ValueManager)) {
	        return new ValueManager(value, errors);
	    }
	    this.listeners = [];
	    this.errorListeners = [];
	    this.validateListeners = [];
	    this.setValue(value || {});
	    this.oldValue = tu.extend({}, this.value);
	    this.setErrors(errors);
	
	    var self = this;
	
	    this.removeListener = removeListener(this.listeners);
	    this.removeErrorListener = removeListener(this.errorListeners);
	    this.addListener = addListener(this.listeners, function (prop) {
	        return self.path(prop, self.value);
	    }, function (prop) {
	        return self.path(prop, self.oldValue);
	    });
	    this.addErrorListener = addListener(this.errorListeners, function (prop) {
	        return self.errorsFor(prop);
	    }, tu.noop);
	
	    this.addValidateListener = addListener(this.validateListeners, tu.noop, tu.noop);
	    this.removeValidateListener = removeListener(this.validateListeners);
	}
	
	ValueManager.prototype = {
	    removeAll: function removeAll() {
	        this.listeners.length = 0;
	        this.errorListeners.length = 0;
	    },
	
	    onValueChange: function onValueChange(path, value, oldValue) {
	        var _this = this;
	
	        var parts = path && path.split('.') || [],
	            i = 0,
	            l = parts.length,
	            pp = null;
	        do {
	            if (this.listeners.some(function (v) {
	                if (v.path === pp) {
	                    return v.listener.call(v.scope, _this.path(pp, _this.value), _this.path(pp, _this.oldValue), path) === false;
	                }
	            }, this) === true) {
	                return false;
	            }
	            pp = tu.path(pp, parts[i]);
	        } while (i++ < l);
	    },
	    path: function path(p, obj) {
	        if (arguments.length < 2) {
	            obj = this.value;
	        }
	        if (!p) {
	            return obj;
	        }var parts = p.split('.');
	
	        for (var i = 0, l = parts.length; i < l; i++) {
	            var key = parts[i];
	            if (obj == null || !(key in obj)) {
	                return null;
	            }
	            obj = obj[key];
	        }
	        return obj;
	    },
	    update: function update(path, value) {
	        var parts = path.split('.'),
	            obj = this.value || (this.value = {}),
	            oobj = this.oldValue,
	            last = parts[parts.length - 1];
	
	        for (var i = 0, l = parts.length - 1; i < l; i++) {
	            var key = parts[i];
	
	            if (key in obj) {
	                //We won't build the oobj tree, we may need to in the case of multiple changes to the object.  The question becomes
	                // are old values the original values or the last change.
	                oobj = oobj && oobj[key];
	
	                //We copy it so that when oldValues and value share a nested object, they do not conflict, but we only need to do it when
	                // they are referencing the same instance, note we are parts -1 levels up, so really only arrays and objects.
	                obj = obj[key] = oobj === obj[key] ? copy(obj[key]) : obj[key];
	            } else {
	
	                //So the object tree isn't reached yet, we will create an array or object. if the key
	                // is an integer we will guess its an array, this will probably be correct 99% of the time, and
	                // horrible wrong 1%, se la vie.
	                if (/^\d+?$/.test(parts[i + 1])) {
	                    obj = obj[key] = [];
	                } else {
	                    obj = obj[key] = {};
	                }
	            }
	        }
	
	        obj[last] = value;
	
	        //We will build a path for the new value, but not for the oldvalue.   This
	        // might break whean a value changes multiple times.
	        return this.onValueChange(path, value, oobj && oobj[last]) !== false;
	    },
	    getValue: function getValue() {
	        return this.value;
	    },
	    setValue: function setValue(value) {
	        this.oldValue = tu.extend({}, this.value);
	        this.value = tu.extend({}, value);
	        if (this._setValue(value, this.oldValue) !== false) {}
	    },
	    _keys: function _keys() {
	        var args = Array.prototype.slice.call(arguments).map(function (v) {
	            return canDescend(v) ? Object.keys(v) : null;
	        });
	        return tu.unique(Array.prototype.concat.apply([], args).filter(tu.nullCheck));
	    },
	    _setValue: function _setValue(value, oldValue, path) {
	        if (canDescend(value) || canDescend(oldValue)) {
	            this._keys(value, oldValue).forEach(function (key) {
	                this._setValue(value && value[key], oldValue && oldValue[key], tu.path(path, key));
	            }, this);
	        } else {
	            return this.onValueChange(path, value, oldValue);
	        }
	    },
	    onError: function onError(path, errors) {
	        errors = errors && errors[0] ? errors : null;
	        var oErrors = this.errors || {},
	            listeners = this.errorListeners;
	
	        return listeners.some(function (v) {
	            if (path == null || v.path == null || v.path === path || path.indexOf(v.path + '.') === 0) {
	                return v.listener.call(v.scope, errors, oErrors[path], path) === false;
	            }
	        }, this);
	    },
	    setErrors: function setErrors(errors) {
	        var keys = this._keys(errors, this.errors);
	        this.errors = tu.extend({}, errors);
	        return keys.some(function (key) {
	            return this.onError(key, this.errors[key]);
	        }, this) !== true;
	    },
	    getErrors: function getErrors() {
	        var ret = {};
	        Object.keys(this.errors).filter(function (v) {
	            return this[v] != null;
	        }, this.errors).forEach(function (v) {
	            ret[v] = this[v];
	        }, this.errors);
	        return ret;
	    },
	    updateErrors: function updateErrors(path, errors) {
	        errors = Array.isArray(errors) ? errors : [errors];
	        errors = errors && errors[0] ? errors : null;
	        this.errors[path] = errors;
	        this.onError(path, errors);
	    },
	    errorsFor: function errorsFor(path) {
	        var pathe = path + '.',
	            keys = Object.keys(this.errors).filter(function (key) {
	            return this[key] != null && (path == null || key === path || key.indexOf(pathe) === 0);
	        }, this.errors),
	            errors = [];
	
	        if (keys.length < 2) {
	            return this.errors[keys[0]];
	        }
	        keys.forEach(function (key) {
	            tu.push(errors, this[key]);
	        }, this.errors);
	        return errors;
	    },
	    /**
	     * Trigger the validators.
	     *
	     */
	    validate: function validate(path) {
	        var pp = path && path + '.';
	        this.validateListeners.forEach(function ValueManager$validate$forEach(v) {
	            if (path == null || v.path === path || pp.indexOf(path) === 0) v.listener.call(v.scope, path);
	        });
	    }
	};
	
	module.exports = ValueManager;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1),
	    tu = __webpack_require__(6),
	    BasicFieldMixin = __webpack_require__(32);
	var FieldMixin = tu.extend({}, BasicFieldMixin, {
	    getDefaultProps: function getDefaultProps() {
	        return {
	            title: '',
	            name: '',
	            placeholder: '',
	            dataType: this.dataType,
	            editorClass: '',
	            onValidate: function onValidate() {}
	        };
	    },
	
	    getValue: function getValue() {
	        return this.state && this.state.value;
	    },
	    setValue: function setValue(value) {
	        this.setState({
	            value: value
	        });
	    },
	    valueFromEvt: function valueFromEvt(e) {
	        return e.target.value;
	    },
	    handleChange: function handleChange(e) {
	        this.updateValue(this.valueFromEvt(e));
	    },
	    handleValidate: function handleValidate(e) {
	        this.props.onValidate(this.valueFromEvt(e), this, e);
	    }
	
	});
	
	module.exports = FieldMixin;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	var tu = __webpack_require__(6);
	var Editor = __webpack_require__(10);
	var loader = __webpack_require__(12);
	var ValueManager = __webpack_require__(7);
	var NestedMixin = {
	    getDefaultProps: function getDefaultProps() {
	        return {
	            path: null,
	
	            schema: {},
	            valueManager: ValueManager()
	        };
	    },
	    componentWillMount: function componentWillMount() {
	        if (this.props.value) {
	            this.props.valueManager.setValue(this.props.value);
	        }
	        if (this.props.errors) {
	            this.props.valueManager.setErrors(this.props.errors);
	        }
	    },
	    makeFieldset: function makeFieldset(f, i) {
	        var Template = loader.loadTemplate(f.template || 'FieldSetTemplate');
	        return React.createElement(
	            Template,
	            { key: 'f' + i, field: f },
	            this.makeFields(f.fields).map(this.addEditor, this)
	        );
	    },
	
	    getValue: function getValue() {
	        return this.props.valueManager.path(this.props.path);
	    },
	    addEditor: function addEditor(field) {
	        var f = field.name;
	        var path = this.props.path;
	
	        var tmpl = {},
	            path = tu.path(path, f);
	        if (field.template) {
	            tmpl.template = field.template;
	        }
	        return React.createElement(Editor, _extends({ ref: f, key: 'key-' + f, path: path,
	            field: field,
	            name: f
	        }, tmpl, {
	            valueManager: this.props.valueManager }));
	    },
	    makeFields: function makeFields(fields) {
	        var fieldMap = {},
	            schema = this.schema.schema;
	
	        fields = tu.toArray(fields).map(function (v) {
	            return v.split('.', 2);
	        }).map(function (v) {
	            var f = v[0];
	            if (v.length > 1) {
	                (fieldMap[f] || (fieldMap[f] = [])).push(v[1]);
	            }
	            return f;
	        });
	
	        return tu.unique(fields).filter(function (f) {
	            return schema[f];
	        }).map(function (f) {
	
	            var ref = tu.isString(f) ? schema[f] : f;
	            if (tu.isString(ref)) {
	                ref = {
	                    name: f,
	                    type: ref
	                };
	            } else {
	                if (!ref.type) {
	                    ref.type = 'Text';
	                }
	                if (!ref.name) {
	                    ref.name = f;
	                }
	            }
	            if (!ref.fields && fieldMap[f]) {
	                ref.fields = fieldMap[f];
	            }
	            return ref;
	        });
	    },
	    normalizeSchema: function normalizeSchema(schema) {
	        if (schema == null) {
	            return {};
	        }
	        if (tu.isString(schema)) {
	            var loaded = loader.loadSchema(schema);
	            if (loaded.schema) {
	                schema = loaded;
	            } else {
	                schema = { schema: loaded };
	            }
	        } else if (tu.isString(schema.schema)) {
	            var loaded = loader.loadSchema(schema.schema);
	            if (loaded.schema) {
	                schema = loaded;
	            } else {
	                schema = { schema: loaded };
	            }
	        }
	        return schema;
	    },
	
	    renderSchema: function renderSchema() {
	
	        var schema = this.schema,
	            fieldsets = schema.fieldsets,
	            fields = schema.fields || Object.keys(schema.schema);
	        return (fieldsets && Array.isArray(fieldsets) ? fieldsets : fieldsets && (fieldsets.legend || fieldsets.fields) ? [fieldsets] : [{ fields: tu.toArray(fields) }]).map(this.makeFieldset, this);
	    }
	};
	module.exports = NestedMixin;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	var tu = __webpack_require__(6);
	var EMPTY_ARR = [];
	var loader = __webpack_require__(12);
	'use strict';
	function initValidators(v) {
	    //If it has a type init it
	    if (v.type) {
	        var validator = loader.loadValidator(v.type);
	        return validator(v);
	    }
	    //If it is a RegExp than init ReExp
	    if (tu.isRegExp(v)) {
	        return loader.loadValidator('regexp')({
	            regexp: v
	        });
	    }
	    //If its a function just return it.
	    if (tu.isFunction(v)) {
	        return v;
	    }
	    //otherwise lets try initing it.
	    return loader.loadValidator(v)();
	}
	
	var Editor = React.createClass({
	    displayName: 'Editor',
	
	    getDefaultProps: function getDefaultProps() {
	        return {
	            field: {
	                type: 'Text'
	            },
	            onValueChange: function onValueChange() {},
	            onValidate: function onValidate() {},
	            template: 'EditorTemplate'
	
	        };
	    },
	    getInitialState: function getInitialState() {
	        return {
	            hasChanged: false
	        };
	    },
	
	    setValue: function setValue(value) {
	        this.refs.field.setValue(value);
	    },
	    componentWillMount: function componentWillMount() {
	        var validators = this.props.field.validators;
	        this.validators = validators ? validators.map(initValidators) : EMPTY_ARR;
	        this.props.valueManager.addListener(this.props.path, this.handleChange, this, true);
	        this.props.valueManager.addValidateListener(this.props.path, this._validate, this);
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        this.props.valueManager.removeListener(this.props.path, this.handleChange);
	        this.props.valueManager.removeValidateListener(this.props.path, this._validate);
	    },
	    handleValidate: function handleValidate(value, component, e) {
	        this.state.hasValidated = true;
	        this.validate();
	    },
	
	    handleChange: function handleChange(newValue, oldValue, name) {
	        var hasChanged = newValue != oldValue;
	        if (!hasChanged) {
	            return;
	        }
	        this.state.hasChanged = true;
	        var errors = this.getErrorMessages(newValue);
	        if (!this.state.hasValidated) {
	            if (!errors || errors.length === 0) {
	                this.state.hasValidated = true;
	            }
	        } else {
	            this.validate(newValue, errors);
	        }
	    },
	    getValue: function getValue() {
	        return this.props.valueManager.path(this.props.path);
	    },
	
	    /**
	     * Runs validation and updates empty fields.
	     *
	     */
	    validate: function validate(value, errors) {
	        value = arguments.length === 0 ? this.getValue() : value;
	        errors = errors || this.getErrorMessages(value);
	
	        this.props.valueManager.updateErrors(this.props.path, errors);
	        this.setState({
	            hasValidated: true
	        });
	        return errors;
	    },
	    _validate: function _validate() {
	        this.validate(this.getValue());
	    },
	    getErrorMessages: function getErrorMessages(value) {
	        var vm = this.props.valueManager;
	
	        value = arguments.length === 0 ? this.getValue() : value;
	        var msgs = this.validators.map(function (v) {
	            return v(value, vm);
	        }).filter(tu.nullCheck);
	        return msgs;
	    },
	
	    title: function title() {
	        var field = this.props.field || {};
	        if (field.title === false) {
	            return null;
	        }
	        if (field.title != null) {
	            return field.title;
	        }
	        //Add spaces
	        return field.name.replace(/([A-Z])/g, ' $1').replace(/^./, function (s) {
	            return s.toUpperCase();
	        });
	    },
	    render: function render() {
	        var _props = this.props;
	        var field = _props.field;
	        var name = _props.name;
	        var value = _props.value;
	        var path = _props.path;
	        var onValueChange = _props.onValueChange;
	        var template = _props.template;
	        var onValidate = _props.onValidate;
	
	        var props = _objectWithoutProperties(_props, ['field', 'name', 'value', 'path', 'onValueChange', 'template', 'onValidate']);
	
	        var name = field.name;
	        var type = field.type;
	        var fieldClass = field.fieldClass;
	        var editorClass = field.editorClass;
	        var errorClassName = field.errorClassName;
	        var help = field.help;
	
	        //err = errors, //&& errors[path] && errors[path][0] && errors[path],
	        var Component = loader.loadType(type),
	            title = this.title(),
	            errorClassName = errorClassName == null ? 'has-error' : errorClassName;
	        var Template;
	        if (template === false || field.template === false || type === 'Hidden') {
	            Template = null;
	        } else {
	            Template = loader.loadTemplate(template || 'EditorTemplate');
	        }
	        var child = React.createElement(Component, _extends({ ref: 'field' }, props, { field: field, name: name, form: this.props.form,
	            path: path,
	            editorClass: editorClass,
	            valueManager: this.props.valueManager,
	            onValidate: this.handleValidate }));
	        //errMessage, errorClassName, name, fieldClass, title, help
	        return Template ? React.createElement(
	            Template,
	            { field: field, name: name, fieldClass: fieldClass, title: title, help: help, path: path,
	                errorClassName: errorClassName, valueManager: this.props.valueManager },
	            child
	        ) : child;
	    }
	});
	module.exports = Editor;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	//==================================================================================================
	//VALIDATORS
	//==================================================================================================
	//Borrowed from backbone-forms, thanks!
	'use strict';
	
	var _ = __webpack_require__(6);
	
	module.exports = (function () {
	
	    var validators = {};
	
	    validators.errMessages = {
	        required: 'Required',
	        regexp: 'Invalid',
	        number: 'Must be a number',
	        email: 'Invalid email address',
	        url: 'Invalid URL',
	        match: _.template('Must match field "<%= field %>"')
	    };
	
	    validators.required = function (options) {
	        options = _.extend({
	            type: 'required',
	            message: this.errMessages.required
	        }, options);
	
	        return function required(value) {
	            options.value = value;
	
	            var err = {
	                type: options.type,
	                message: _.isFunction(options.message) ? options.message(options) : options.message
	            };
	
	            if (value === null || value === undefined || value === false || value === '') {
	                return err;
	            }
	        };
	    };
	
	    validators.regexp = function (options) {
	        if (!options.regexp) throw new Error('Missing required "regexp" option for "regexp" validator');
	
	        options = _.extend({
	            type: 'regexp',
	            match: true,
	            message: this.errMessages.regexp
	        }, options);
	
	        return function regexp(value) {
	            options.value = value;
	
	            var err = {
	                type: options.type,
	                message: _.isFunction(options.message) ? options.message(options) : options.message
	            };
	
	            //Don't check empty values (add a 'required' validator for this)
	            if (value === null || value === undefined || value === '') {
	                return;
	            } //Create RegExp from string if it's valid
	            if ('string' === typeof options.regexp) options.regexp = new RegExp(options.regexp, options.flags);
	
	            if (options.match ? !options.regexp.test(value) : options.regexp.test(value)) {
	                return err;
	            }
	        };
	    };
	
	    validators.number = function (options) {
	        options = _.extend({
	            type: 'number',
	            message: this.errMessages.number,
	            regexp: /^[0-9]*\.?[0-9]*?$/
	        }, options);
	
	        return validators.regexp(options);
	    };
	
	    validators.email = function (options) {
	        options = _.extend({
	            type: 'email',
	            message: this.errMessages.email,
	            regexp: /^[\w\-]{1,}([\w\-\+.]{1,1}[\w\-]{1,}){0,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/
	        }, options);
	
	        return validators.regexp(options);
	    };
	
	    validators.url = function (options) {
	        options = _.extend({
	            type: 'url',
	            message: this.errMessages.url,
	            regexp: /^(http|https):\/\/(([A-Z0-9][A-Z0-9_\-]*)(\.[A-Z0-9][A-Z0-9_\-]*)+)(:(\d+))?\/?/i
	        }, options);
	
	        return validators.regexp(options);
	    };
	
	    validators.match = function (options) {
	        if (!options.field) throw new Error('Missing required "field" options for "match" validator');
	
	        options = _.extend({
	            type: 'match',
	            message: this.errMessages.match
	        }, options);
	
	        return function match(value, attrs) {
	            options.value = value;
	
	            var err = {
	                type: options.type,
	                message: _.isFunction(options.message) ? options.message(options) : options.message
	            };
	
	            //Don't check empty values (add a 'required' validator for this)
	            if (value === null || value === undefined || value === '') {
	                return;
	            }if (value !== attrs.path(options.field)) {
	                return err;
	            }
	        };
	    };
	
	    return validators;
	})();

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var tu = __webpack_require__(6),
	    concat = Function.apply.bind(Array.prototype.concat, []),
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
	    addLoader: function addLoader(loader) {
	        loaders.unshift(loader);
	        return loader;
	    },
	    removeLoader: function removeLoader(loader) {
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
	
	    clearLoaders: function clearLoaders() {
	        var ret = loaders.concat();
	        loaders.length = 0;
	        return ret;
	    }
	};
	
	api.addLoader({
	    loadTemplate: function loadTemplate(template) {
	        return __webpack_require__(33)('./' + template + '.jsx');
	    },
	    listTemplates: function listTemplates() {
	
	        return __webpack_require__(34).keys().map(function (k) {
	            return {
	                name: k.replace(/.*\/(.*)\.js(x?)/, '$1'),
	                path: k
	            };
	        });
	    },
	    loadType: function loadType(type) {
	        return __webpack_require__(35)('./' + type + '.jsx');
	    },
	    listTypes: function listTypes() {
	        return __webpack_require__(35).keys().map(function (k) {
	            return {
	                name: k.replace(/.*\/(.*)\.js(x?)/, '$1'),
	                path: k
	            };
	        }).filter(function (v) {
	            return !/Mixin$/.test(v.name);
	        });
	    },
	    loadValidator: function loadValidator(validator) {
	        var validators = __webpack_require__(11);
	        return validators[validator] && validators[validator].bind(validators);
	    },
	    listValidators: function listValidators() {
	        var validators = __webpack_require__(11);
	        return Object.keys(validators).map(function (name) {
	            var validator = validators[name];
	            return {
	                name: name, validator: validator
	            };
	        });
	    }
	});
	
	function list(method) {
	    var type = 'list' + method + 's';
	    return function loader$list() {
	        return concat(loaders.filter(function (v) {
	            return typeof v[type] === 'function';
	        }).map(function (v) {
	            return v[type]();
	        }));
	    };
	}
	function load(method) {
	    method = 'load' + method;
	    return function load$load(load) {
	        var i = 0,
	            l = loaders.length,
	            ret = null;
	        for (; i < l; i++) {
	            var ret = loaders[i][method] && loaders[i][method].apply(this, arguments);
	            if (ret != null) {
	                return ret;
	            }
	        }
	
	        // return require(load);
	    };
	}
	function add(type) {
	    var listKey = 'list' + type + 's',
	        loadKey = 'load' + type,
	        lcType = type.toLowerCase();
	    return function loader$add(key, value) {
	        var map,
	            _api = {};
	        if (tu.isString(key)) {
	            map = {};
	            map[key] = value;
	        } else {
	            map = key;
	        }
	        _api[listKey] = function () {
	            return Object.keys(map).map(function (name) {
	                var ret = { name: name };
	                ret[lcType] = map[name];
	                return ret;
	            });
	        };
	        _api[loadKey] = function (name) {
	            return map[name];
	        };
	        api.addLoader(_api);
	        return _api;
	    };
	}
	module.exports = api;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var types = {};
	
	__webpack_require__(36).keys().forEach(function (v) {
	    var name = v.replace(/\.\/(.*)\.js(x)?/, '$1');
	    types[name] = __webpack_require__(37)("./" + v.replace('./', ''));
	});
	module.exports = types;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1);
	var loader = __webpack_require__(12);
	var schema = {};
	loader.listTypes().forEach(function (type) {
	    schema[type.name] = {
	        type: type.name,
	        fieldClass: 'row'
	    };
	});
	
	module.exports = {
	    description: 'All the components with no options passed, just a place to make sure everything is here.   This may not be a good idea.',
	    schema: {
	        schema: schema
	    }
	
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
	    description: 'Autocomplete adds static or dynamic autocompletion.<br/>  If options are passed than it behaves mostly like the select component',
	    schema: {
	        schema: {
	            simple: {
	                type: 'Autocomplete',
	                options: ['aaaa', 'aaab', 'aba', 'baaa', 'caaa']
	            },
	            ajax: {
	                type: 'Autocomplete',
	                processor: 'fakeAjax'
	            }
	        }
	    },
	    data: {
	        simple: 'aaaa',
	        ajax: {
	            val: '1',
	            label: 'a 1'
	        }
	    },
	    setup: function setup() {
	        /**
	         * Register a fake loader.
	         * @type {{fetch: Function, format: Function}}
	         */
	        var fakeAjax = {
	            fetch: function fetch(url, value, component, cb) {
	                //You can fire an ajax request here.
	                var ti = setTimeout(function () {
	                    var ret = [];
	                    for (var i = 0; i < 10 - value.length; i++) {
	                        ret.push({
	                            val: i,
	                            label: value + ' ' + i
	                        });
	                    }
	
	                    //callback err, value.
	                    cb(null, ret);
	                }, 200);
	                return {
	                    cancel: function cancel() {
	                        //You could abort an AJAX request here.
	                        clearTimeout(ti);
	                    }
	                };
	            },
	            value: function value(obj) {
	                return obj;
	            },
	            format: function format(value) {
	                return value && value.label;
	            }
	        };
	        var loader = __webpack_require__(12);
	        this._loader = loader.addLoader({
	            loadProcessor: function loadProcessor(name) {
	                if (name === 'fakeAjax') {
	                    return fakeAjax;
	                }
	            },
	            listProcessors: function listProcessors() {
	                return [{ name: 'fakeAjax', processor: fakeAjax }];
	            }
	        });
	    },
	    teardown: function teardown() {
	        __webpack_require__(12).removeLoader(this._loader);
	    }
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = {
	    description: "Super basic form, with select and a requied name",
	    schema: {
	        schema: {
	            title: { type: "Select", options: ["Mr", "Mrs", "Ms"] },
	            name: { type: "Text", validators: ["required"] }
	
	        },
	        fieldsets: [{ legend: "Name", fields: ["title", "name"] }]
	    },
	    data: {
	        title: "Mrs",
	        name: "Johnson"
	    },
	    errors: {
	        name: [{
	            message: "Name is already taken"
	        }]
	    }
	
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	module.exports = {
	    description: '<p>This shows how to use a loader to load a schema</p>    <p>It can be used to load Templates, Processors, Types, Schemas and Validators. Here we are demonstrating templates and schemas, but the same pattern applies to the other types </p>    They all follow the same pattern.   Note the list`type` is optional, but useful for future introspection if needed    ',
	    schema: 'Contact',
	    data: {
	        name: 'Robert Loblaw',
	        primary: {
	            address: '123 Main St',
	            city: 'San Jose',
	            state: 'CA'
	        },
	        otherAddresses: [{
	            address: '456 2nd St',
	            city: 'Chicago',
	            state: 'IL'
	        }, {
	            address: '3232 Fillmore St',
	            city: 'Arlington',
	            state: 'VA'
	        }]
	    },
	    errors: {
	        'primary.address': [{ message: 'No Such Place' }]
	    },
	    unsetup: function unsetup(l) {
	        var loader = __webpack_require__(12).removeLoader(l);
	    },
	    setup: function setup() {
	        var loader = __webpack_require__(12);
	        /**
	         * If you are using a jsx compiler you would just
	         * use jsx, but due to things, its not jsx.
	         */
	        loader.addTemplate('SimpleTemplate', React.createClass({
	            displayName: 'SimpleTemplate',
	            render: function render() {
	                var _props = this.props;
	                var name = _props.name;
	                var title = _props.title;
	                var help = _props.help;
	                var errorClassName = _props.errorClassName;
	                var message = _props.message;
	                var fieldClass = _props.fieldClass;
	                var children = _props.children;
	
	                return React.createElement(
	                    'div',
	                    {
	                        className: 'form-group field-name ' + (message != null ? errorClassName : '') + ' ' + fieldClass },
	                    React.createElement(
	                        'div',
	                        { className: '' },
	                        children,
	                        React.createElement(
	                            'p',
	                            { className: 'help-block', ref: 'help' },
	                            message || help
	                        )
	                    )
	                );
	            }
	        }));
	        var Object = __webpack_require__(13).Object;
	        loader.addType('ToggleObject', React.createClass({
	            displayName: 'ToggleObject',
	            getInitialState: function getInitialState() {
	                return {
	                    toggled: false
	                };
	            },
	            handleToggle: function handleToggle() {
	                this.setState({ toggled: !this.state.toggled });
	            },
	            getValue: function getValue() {
	                return this.refs.val.getValue();
	            },
	            setValue: function setValue(val) {
	                this.refs.val.setValue(val);
	            },
	            render: function render() {
	                var style = {
	                    display: this.state.toggled ? 'none' : 'block'
	                };
	
	                return React.createElement(
	                    'div',
	                    { className: 'form-group row' },
	                    React.createElement(
	                        'legend',
	                        { onClick: this.handleToggle },
	                        'Toggle ',
	                        this.state.toggled ? 'Up' : 'Down'
	                    ),
	                    React.createElement(
	                        'div',
	                        { style: style },
	                        React.createElement(Object, _extends({ ref: 'val' }, this.props))
	                    )
	                );
	            }
	        }));
	        var loaded = loader.addSchema({
	            Address: {
	                address: 'Text',
	                city: 'Text',
	                state: {
	                    type: 'Select',
	                    options: ['CA', 'FL', 'VA', 'IL']
	                },
	                zipCode: {
	                    type: 'Text',
	                    dataType: 'number'
	                }
	            },
	            Contact: {
	                schema: {
	                    name: 'Text',
	                    primary: {
	                        type: 'ToggleObject',
	                        subSchema: 'Address',
	                        template: 'SimpleTemplate'
	                    },
	                    otherAddresses: {
	                        canEdit: true,
	                        canReorder: true,
	                        canDelete: true,
	                        canAdd: true,
	                        type: 'List',
	                        labelKey: 'address',
	                        itemType: {
	                            type: 'Object',
	                            subSchema: 'Address'
	                        }
	                    }
	                },
	                fields: ['name', 'primary', 'otherAddresses']
	            }
	        });
	        return loaded;
	    }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = {
	    description: "Nested froms allow for deeply structured object<br/>. If you need more flexibility consider Mixed or List",
	    schema: {
	        schema: {
	            title: {
	                type: "Select",
	                options: ["Mr", "Mrs", "Ms"]
	            },
	            name: "Text",
	            email: {
	                type: "Text",
	                dataType: "email",
	                validators: ["required", "email"]
	            },
	            address: {
	                type: "Object",
	                title: false,
	                subSchema: {
	                    street: { type: "Text", validators: ["required"] },
	                    city: "Text",
	                    state: {
	                        options: ["CA", "NV", "DE"],
	                        type: "Select"
	                    },
	                    zip: {
	                        type: "Text",
	                        validators: ["required", /^[0-9]{5}(-([0-9]{4}))?$/]
	                    }
	                }
	            }
	        },
	        submitButton: "Submit",
	        fieldsets: [{
	            legend: "Name",
	            fields: ["title", "name", "email"]
	        }, {
	            legend: "Address",
	            fields: "address.street, address.city, address.state, address.zip"
	        }]
	    },
	    data: {
	        title: "Mr",
	        name: "bob",
	        email: "bob@b.co",
	        address: {
	            street: "1 First St",
	            city: "San Jose",
	            state: "CA",
	            zip: 95109
	        }
	    },
	    errors: {
	        "address.city": [{
	            message: "Not the right place"
	        }]
	    }
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
	    description: 'Questionaire shows the used of the Mixed Type.      The mixed type is just like a List, however it can have non numeric keys.     The keys and the values are configurable. As of now however you can only have 1 key type and 1 object type',
	    schema: {
	        schema: {
	            questionare: {
	                type: 'Mixed',
	                keyType: 'Text',
	                title: 'Questioniare',
	                labelKey: 'answer',
	                canEdit: true,
	                canDelete: true,
	                canReorder: true,
	                canAdd: true,
	                valueType: {
	                    type: 'Object',
	                    subSchema: {
	                        answer: 'Text',
	                        feel: {
	                            type: 'Radio',
	                            options: ['Good', 'Bad', 'Indifferent']
	                        }
	                    }
	                }
	            }
	        }
	    },
	    data: {
	        questionare: {
	            question1: {
	                answer: 'I know nothing',
	                feel: 'Good'
	            },
	            question2: {
	                answer: 'I still know nothing',
	                feel: 'bad'
	            }
	        }
	    },
	    errors: {
	        'questionare.question2.answer': [{
	            message: 'Are you sure?'
	        }]
	    }
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = {
	    description: "A super simple <b>Todo List</b> because every body's gotta.   This one shows how the List type works.   List editing can be turned on or off, by default its off ",
	    schema: {
	        schema: {
	            tasks: {
	                type: "List",
	                title: "Task",
	                canAdd: true,
	                canDelete: true,
	                canReorder: true,
	                canEdit: true
	            }
	        },
	        fieldsets: [{
	            legend: "Todo",
	            fields: ["tasks"]
	        }]
	    },
	    data: {
	        tasks: ["Get Stuff", "Do Stuff", "Go Home"]
	    },
	    errors: {
	        "todos.1": [{
	            message: "No your not going to"
	        }]
	    }
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
	    description: 'This shows a multistep form aka Wizard.    The basics are your fieldsets become steps in a wizard.  The legend becomes the label and the fields are rendered    Sometimes you a good wizard goes a long way    ',
	    props: {
	        template: 'WizardTemplate'
	    },
	    data: {
	        username: 'a@b.c',
	        password: '123',
	        confirmPassword: '123',
	        terms: false,
	        address: {
	            address: '1 Main St',
	            city: 'Arlington',
	            state: 'CA',
	            zip: 95130
	        }
	    },
	    schema: {
	        schema: {
	            username: {
	                type: 'Text',
	                help: 'Please enter your email address',
	                validators: ['required', 'email']
	            },
	            password: {
	                validators: ['required'],
	                type: 'Password'
	            },
	            confirmPassword: {
	                type: 'Password',
	                validators: ['required', { type: 'match', field: 'password', message: 'Passwords do not match' }]
	            },
	            terms: {
	                type: 'Checkbox',
	                title: 'Do you accept the terms?'
	            },
	            address: {
	                type: 'Object',
	                subSchema: {
	                    address: {
	                        type: 'Text',
	                        validators: ['required']
	                    },
	                    city: {
	                        type: 'Text',
	                        validators: ['required']
	                    },
	                    state: {
	                        type: 'Select',
	                        options: ['CA', 'VA', 'DC'],
	                        validators: ['required']
	                    }
	                }
	            }
	
	        },
	        fieldsets: [{
	            legend: 'Account',
	            fields: ['username', 'password', 'confirmPassword']
	        }, {
	            legend: 'Terms',
	            fields: ['terms']
	
	        }, {
	            legend: 'Address',
	            fields: ['address.address', 'address.city', 'address.state']
	        }]
	    }
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
	    description: 'The most usable of UI components the lowly checkbox.   This shows single value, groups of checkboxes and a true/false',
	    schema: {
	        schema: {
	            group1: {
	                options: ['one', 'two', 'three'],
	                type: 'Checkboxes'
	            },
	            group2: {
	                options: [{ val: 'one' }, { val: 'two', labelHTML: '<h2>awesome</h2>' }],
	                type: 'Checkboxes'
	            },
	            trueFalse: {
	                type: 'Checkbox',
	                title: 'True or False No Value'
	            },
	            groupsOfGroups: {
	                options: [{
	                    group: 'North America', options: [{ val: 'ca', label: 'Canada' }, { val: 'us', label: 'United States' }]
	                }, {
	                    group: 'Europe', options: [{ val: 'es', label: 'Spain' }, { val: 'fr', label: 'France' }, { val: 'uk', label: 'United Kingdom' }]
	                }],
	                type: 'Checkboxes'
	            }
	        }
	    },
	    data: {
	        trueFalse: true,
	        group1: ['two'],
	        group2: ['one'],
	        groupsOfGroups: ['us', 'uk']
	    },
	    errors: {
	        groupsOfGroups: [{ message: 'Even a checkbox can go wrong' }]
	    }
	
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
	    description: 'Sometimes you do not want to show your data.  Hidden to the rescue    The only thing special about hidden, is that it does not render the surrounding editor markup, as if something is hidden its    label should be hidden also    ',
	    schema: {
	        schema: {
	            hideme: {
	                type: 'Hidden'
	            }
	
	        },
	        fieldsets: { legend: 'Magical Hidden Field', fields: ['hideme'] }
	    },
	    data: {
	        hideme: {
	            stuff: {
	                is: {
	                    here: 1
	                }
	            }
	        }
	    },
	    errors: {}
	
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
	    description: 'This is a very basic login form. But it shows both email validation and multi field validation',
	    schema: {
	        schema: {
	            username: {
	                type: 'Text',
	                help: 'Please enter your email address',
	                validators: ['required', 'email']
	            },
	            password: {
	                validators: ['required'],
	                type: 'Password'
	            },
	            confirmPassword: {
	                type: 'Password',
	                validators: [{ type: 'match', field: 'password', message: 'Passwords do not match' }]
	            }
	        },
	        submitButton: 'Login'
	    },
	    data: {},
	    errors: {
	        username: [{
	            message: 'This username already exists'
	        }]
	    }
	
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = {
	    description: "Getting radios right is suprisingly tricky.  Here we demonstrate how to use groups radios and radio groups",
	    schema: {
	        schema: {
	            radio1: {
	                options: [{
	                    val: 0,
	                    label: "Option 1"
	                }, {
	                    val: 1,
	                    label: "Option 2"
	                }, {
	                    val: 2,
	                    label: "Option 3"
	                }],
	                type: "Radio"
	            },
	            radio2: {
	                options: ["Sterling", "Lana", "Cyril", "Cheryl", "Pam"],
	                type: "Radio"
	            },
	            radioWithLabel: {
	                options: [{
	                    labelHTML: "<b>HTML</b>"
	                }],
	                type: "Radio"
	            }
	        }
	    },
	    data: {
	        radio1: 1,
	        radio2: "Cyril",
	        radioWithLabel: 0
	    },
	    errors: {}
	
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = _interopRequire(__webpack_require__(1));
	
	var classNames = _interopRequire(__webpack_require__(87));
	
	var BootstrapMixin = _interopRequire(__webpack_require__(70));
	
	var Alert = React.createClass({
	  displayName: "Alert",
	
	  mixins: [BootstrapMixin],
	
	  propTypes: {
	    onDismiss: React.PropTypes.func,
	    dismissAfter: React.PropTypes.number
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      bsClass: "alert",
	      bsStyle: "info"
	    };
	  },
	
	  renderDismissButton: function renderDismissButton() {
	    return React.createElement(
	      "button",
	      {
	        type: "button",
	        className: "close",
	        onClick: this.props.onDismiss,
	        "aria-hidden": "true" },
	      "×"
	    );
	  },
	
	  render: function render() {
	    var classes = this.getBsClassSet();
	    var isDismissable = !!this.props.onDismiss;
	
	    classes["alert-dismissable"] = isDismissable;
	
	    return React.createElement(
	      "div",
	      _extends({}, this.props, { className: classNames(this.props.className, classes) }),
	      isDismissable ? this.renderDismissButton() : null,
	      this.props.children
	    );
	  },
	
	  componentDidMount: function componentDidMount() {
	    if (this.props.dismissAfter && this.props.onDismiss) {
	      this.dismissTimer = setTimeout(this.props.onDismiss, this.props.dismissAfter);
	    }
	  },
	
	  componentWillUnmount: function componentWillUnmount() {
	    clearTimeout(this.dismissTimer);
	  }
	});
	
	module.exports = Alert;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = _interopRequire(__webpack_require__(1));
	
	var classNames = _interopRequire(__webpack_require__(87));
	
	var BootstrapMixin = _interopRequire(__webpack_require__(70));
	
	var FadeMixin = _interopRequire(__webpack_require__(71));
	
	var domUtils = _interopRequire(__webpack_require__(72));
	
	var EventListener = _interopRequire(__webpack_require__(73));
	
	// TODO:
	// - aria-labelledby
	// - Add `modal-body` div if only one child passed in that doesn't already have it
	// - Tests
	
	var Modal = React.createClass({
	  displayName: "Modal",
	
	  mixins: [BootstrapMixin, FadeMixin],
	
	  propTypes: {
	    title: React.PropTypes.node,
	    backdrop: React.PropTypes.oneOf(["static", true, false]),
	    keyboard: React.PropTypes.bool,
	    closeButton: React.PropTypes.bool,
	    animation: React.PropTypes.bool,
	    onRequestHide: React.PropTypes.func.isRequired
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      bsClass: "modal",
	      backdrop: true,
	      keyboard: true,
	      animation: true,
	      closeButton: true
	    };
	  },
	
	  render: function render() {
	    var modalStyle = { display: "block" };
	    var dialogClasses = this.getBsClassSet();
	    delete dialogClasses.modal;
	    dialogClasses["modal-dialog"] = true;
	
	    var classes = {
	      modal: true,
	      fade: this.props.animation,
	      "in": !this.props.animation || !document.querySelectorAll
	    };
	
	    var modal = React.createElement(
	      "div",
	      _extends({}, this.props, {
	        title: null,
	        tabIndex: "-1",
	        role: "dialog",
	        style: modalStyle,
	        className: classNames(this.props.className, classes),
	        onClick: this.props.backdrop === true ? this.handleBackdropClick : null,
	        ref: "modal" }),
	      React.createElement(
	        "div",
	        { className: classNames(dialogClasses) },
	        React.createElement(
	          "div",
	          { className: "modal-content", style: { overflow: "hidden" } },
	          this.props.title ? this.renderHeader() : null,
	          this.props.children
	        )
	      )
	    );
	
	    return this.props.backdrop ? this.renderBackdrop(modal) : modal;
	  },
	
	  renderBackdrop: function renderBackdrop(modal) {
	    var classes = {
	      "modal-backdrop": true,
	      fade: this.props.animation
	    };
	
	    classes["in"] = !this.props.animation || !document.querySelectorAll;
	
	    var onClick = this.props.backdrop === true ? this.handleBackdropClick : null;
	
	    return React.createElement(
	      "div",
	      null,
	      React.createElement("div", { className: classNames(classes), ref: "backdrop", onClick: onClick }),
	      modal
	    );
	  },
	
	  renderHeader: function renderHeader() {
	    var closeButton = undefined;
	    if (this.props.closeButton) {
	      closeButton = React.createElement(
	        "button",
	        { type: "button", className: "close", "aria-hidden": "true", onClick: this.props.onRequestHide },
	        "×"
	      );
	    }
	
	    var style = this.props.bsStyle;
	    var classes = {
	      "modal-header": true
	    };
	    classes["bg-" + style] = style;
	    classes["text-" + style] = style;
	
	    var className = classNames(classes);
	
	    return React.createElement(
	      "div",
	      { className: className },
	      closeButton,
	      this.renderTitle()
	    );
	  },
	
	  renderTitle: function renderTitle() {
	    return React.isValidElement(this.props.title) ? this.props.title : React.createElement(
	      "h4",
	      { className: "modal-title" },
	      this.props.title
	    );
	  },
	
	  iosClickHack: function iosClickHack() {
	    // IOS only allows click events to be delegated to the document on elements
	    // it considers 'clickable' - anchors, buttons, etc. We fake a click handler on the
	    // DOM nodes themselves. Remove if handled by React: https://github.com/facebook/react/issues/1169
	    React.findDOMNode(this.refs.modal).onclick = function () {};
	    React.findDOMNode(this.refs.backdrop).onclick = function () {};
	  },
	
	  componentDidMount: function componentDidMount() {
	    this._onDocumentKeyupListener = EventListener.listen(domUtils.ownerDocument(this), "keyup", this.handleDocumentKeyUp);
	
	    var container = this.props.container && React.findDOMNode(this.props.container) || domUtils.ownerDocument(this).body;
	    container.className += container.className.length ? " modal-open" : "modal-open";
	
	    if (this.props.backdrop) {
	      this.iosClickHack();
	    }
	  },
	
	  componentDidUpdate: function componentDidUpdate(prevProps) {
	    if (this.props.backdrop && this.props.backdrop !== prevProps.backdrop) {
	      this.iosClickHack();
	    }
	  },
	
	  componentWillUnmount: function componentWillUnmount() {
	    this._onDocumentKeyupListener.remove();
	    var container = this.props.container && React.findDOMNode(this.props.container) || domUtils.ownerDocument(this).body;
	    container.className = container.className.replace(/ ?modal-open/, "");
	  },
	
	  handleBackdropClick: function handleBackdropClick(e) {
	    if (e.target !== e.currentTarget) {
	      return;
	    }
	
	    this.props.onRequestHide();
	  },
	
	  handleDocumentKeyUp: function handleDocumentKeyUp(e) {
	    if (this.props.keyboard && e.keyCode === 27) {
	      this.props.onRequestHide();
	    }
	  }
	});
	
	module.exports = Modal;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var _react = __webpack_require__(1);
	
	var React = _interopRequire(_react);
	
	var cloneElement = _react.cloneElement;
	
	var OverlayMixin = _interopRequire(__webpack_require__(74));
	
	var createChainedFunction = _interopRequire(__webpack_require__(75));
	
	var ModalTrigger = React.createClass({
	  displayName: "ModalTrigger",
	
	  mixins: [OverlayMixin],
	
	  propTypes: {
	    modal: React.PropTypes.node.isRequired
	  },
	
	  getInitialState: function getInitialState() {
	    return {
	      isOverlayShown: false
	    };
	  },
	
	  show: function show() {
	    this.setState({
	      isOverlayShown: true
	    });
	  },
	
	  hide: function hide() {
	    this.setState({
	      isOverlayShown: false
	    });
	  },
	
	  toggle: function toggle() {
	    this.setState({
	      isOverlayShown: !this.state.isOverlayShown
	    });
	  },
	
	  renderOverlay: function renderOverlay() {
	    if (!this.state.isOverlayShown) {
	      return React.createElement("span", null);
	    }
	
	    return cloneElement(this.props.modal, {
	      onRequestHide: this.hide
	    });
	  },
	
	  render: function render() {
	    var child = React.Children.only(this.props.children);
	    return cloneElement(child, {
	      onClick: createChainedFunction(child.props.onClick, this.toggle)
	    });
	  }
	});
	
	module.exports = ModalTrigger;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = _interopRequire(__webpack_require__(1));
	
	var classNames = _interopRequire(__webpack_require__(87));
	
	var BootstrapMixin = _interopRequire(__webpack_require__(70));
	
	var Button = React.createClass({
	  displayName: "Button",
	
	  mixins: [BootstrapMixin],
	
	  propTypes: {
	    active: React.PropTypes.bool,
	    disabled: React.PropTypes.bool,
	    block: React.PropTypes.bool,
	    navItem: React.PropTypes.bool,
	    navDropdown: React.PropTypes.bool,
	    componentClass: React.PropTypes.node,
	    href: React.PropTypes.string,
	    target: React.PropTypes.string
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      bsClass: "button",
	      bsStyle: "default",
	      type: "button"
	    };
	  },
	
	  render: function render() {
	    var classes = this.props.navDropdown ? {} : this.getBsClassSet();
	    var renderFuncName = undefined;
	
	    classes = _extends({
	      active: this.props.active,
	      "btn-block": this.props.block }, classes);
	
	    if (this.props.navItem) {
	      return this.renderNavItem(classes);
	    }
	
	    renderFuncName = this.props.href || this.props.target || this.props.navDropdown ? "renderAnchor" : "renderButton";
	
	    return this[renderFuncName](classes);
	  },
	
	  renderAnchor: function renderAnchor(classes) {
	
	    var Component = this.props.componentClass || "a";
	    var href = this.props.href || "#";
	    classes.disabled = this.props.disabled;
	
	    return React.createElement(
	      Component,
	      _extends({}, this.props, {
	        href: href,
	        className: classNames(this.props.className, classes),
	        role: "button" }),
	      this.props.children
	    );
	  },
	
	  renderButton: function renderButton(classes) {
	    var Component = this.props.componentClass || "button";
	
	    return React.createElement(
	      Component,
	      _extends({}, this.props, {
	        className: classNames(this.props.className, classes) }),
	      this.props.children
	    );
	  },
	
	  renderNavItem: function renderNavItem(classes) {
	    var liClasses = {
	      active: this.props.active
	    };
	
	    return React.createElement(
	      "li",
	      { className: classNames(liClasses) },
	      this.renderAnchor(classes)
	    );
	  }
	});
	
	module.exports = Button;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(31);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(38)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/jspears/WebstormProjects/subschema/node_modules/css-loader/index.js!/Users/jspears/WebstormProjects/subschema/node_modules/less-loader/index.js!/Users/jspears/WebstormProjects/subschema/public/index.less", function() {
			var newContent = require("!!/Users/jspears/WebstormProjects/subschema/node_modules/css-loader/index.js!/Users/jspears/WebstormProjects/subschema/node_modules/less-loader/index.js!/Users/jspears/WebstormProjects/subschema/public/index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(76)();
	exports.push([module.id, "/* List */\n.bbf-list .bbf-add {\n  margin-top: -10px;\n}\n.bbf-list li {\n  margin-bottom: 5px;\n}\n.bbf-list .bbf-del {\n  margin-left: 4px;\n}\n.bbf-list {\n  list-style: none;\n}\n/* List.Modal */\n.bbf-list-modal {\n  cursor: pointer;\n  border: 1px solid #ccc;\n  width: 208px;\n  border-radius: 3px;\n  padding: 4px;\n  color: #555;\n}\n.edit-list .btn-group.pull-right {\n  position: absolute;\n  top: 3px;\n  right: 3px;\n}\n.edit-list .btn-group {\n  position: absolute;\n  top: 3px;\n  right: 3px;\n}\n", ""]);

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var FieldMixin = {
	    componentWillMount: function componentWillMount() {
	        if (this.props.value) {
	            this.props.valueManager.setValue(this.props.value);
	        }
	        if (this.props.errors) {
	            this.props.valueManager.setErrors(this.props.errors);
	        }
	        this.props.valueManager.addListener(this.props.path, this.setValue, this, true);
	        this.props.valueManager.addListener(this.props.path, this.props.onValueChange, this);
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        this.props.valueManager.removeListener(this.props.path, this.setValue, this);
	        this.props.valueManager.removeListener(this.props.path, this.props.onValueChange);
	    },
	    updateValue: function updateValue(val) {
	        this.props.valueManager.update(this.props.path, val);
	    }
	};
	
	module.exports = FieldMixin;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./AutocompleteItemTemplate.jsx": 39,
		"./ButtonTemplate.jsx": 40,
		"./CheckboxTemplate.jsx": 41,
		"./CheckboxesGroupTemplate.jsx": 42,
		"./CheckboxesTemplate.jsx": 43,
		"./CollectionCreateTemplate.jsx": 44,
		"./EditorTemplate.jsx": 45,
		"./FieldSetTemplate.jsx": 46,
		"./FormTemplate.jsx": 47,
		"./ListItemTemplate.jsx": 48,
		"./ObjectTemplate.jsx": 49,
		"./RadioItemTemplate.jsx": 50,
		"./WizardTemplate.jsx": 51,
		"./buttonsTemplate.jsx": 52,
		"./index.js": 53
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 33;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./AutocompleteItemTemplate.jsx": 39,
		"./ButtonTemplate.jsx": 40,
		"./CheckboxTemplate.jsx": 41,
		"./CheckboxesGroupTemplate.jsx": 42,
		"./CheckboxesTemplate.jsx": 43,
		"./CollectionCreateTemplate.jsx": 44,
		"./EditorTemplate.jsx": 45,
		"./FieldSetTemplate.jsx": 46,
		"./FormTemplate.jsx": 47,
		"./ListItemTemplate.jsx": 48,
		"./ObjectTemplate.jsx": 49,
		"./RadioItemTemplate.jsx": 50,
		"./WizardTemplate.jsx": 51,
		"./buttonsTemplate.jsx": 52
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 34;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./Autocomplete.jsx": 54,
		"./Checkbox.jsx": 55,
		"./Checkboxes.jsx": 56,
		"./CollectionMixin.jsx": 57,
		"./Date.jsx": 58,
		"./DateTime.jsx": 59,
		"./Hidden.jsx": 60,
		"./List.jsx": 61,
		"./Mixed.jsx": 62,
		"./Object.jsx": 63,
		"./Password.jsx": 64,
		"./Radio.jsx": 65,
		"./Restricted.jsx": 66,
		"./Select.jsx": 67,
		"./Text.jsx": 68,
		"./TextArea.jsx": 69
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 35;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./Autocomplete.jsx": 54,
		"./Checkbox.jsx": 55,
		"./Checkboxes.jsx": 56,
		"./CollectionMixin.jsx": 57,
		"./Date.jsx": 58,
		"./DateTime.jsx": 59,
		"./Hidden.jsx": 60,
		"./List.jsx": 61,
		"./Mixed.jsx": 62,
		"./Object.jsx": 63,
		"./Password.jsx": 64,
		"./Radio.jsx": 65,
		"./Restricted.jsx": 66,
		"./Select.jsx": 67,
		"./Text.jsx": 68,
		"./TextArea.jsx": 69
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 36;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./Autocomplete.jsx": 54,
		"./Checkbox.jsx": 55,
		"./Checkboxes.jsx": 56,
		"./CollectionMixin.jsx": 57,
		"./Date.jsx": 58,
		"./DateTime.jsx": 59,
		"./Hidden.jsx": 60,
		"./List.jsx": 61,
		"./Mixed.jsx": 62,
		"./Object.jsx": 63,
		"./Password.jsx": 64,
		"./Radio.jsx": 65,
		"./Restricted.jsx": 66,
		"./Select.jsx": 67,
		"./Text.jsx": 68,
		"./TextArea.jsx": 69
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 37;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1);
	var AutocompleteItemTemplate = React.createClass({
	    displayName: 'AutocompleteItemTemplate',
	
	    getDefaultProps: function getDefaultProps() {
	        return {
	            data: null,
	            value: null,
	            focus: false,
	            onSelect: function onSelect() {}
	        };
	    },
	    /*shouldComponentUpdate() {
	     // Events never change, so return false always.
	     return false;
	     },*/
	    handleClick: function handleClick(e) {
	        e && e.preventDefault();
	        this.props.onSelect(this.props.data);
	    },
	    render: function render() {
	        var _props = this.props;
	        var data = _props.data;
	        var focus = _props.focus;
	        var value = _props.value;
	        var processor = _props.processor;
	
	        var cls = 'addr_itm list-group-item ' + (focus ? 'focused' : '');
	        var html = processor.format(data, value, true);
	        return html == null ? null : React.createElement('li', { ref: 'item', className: cls, onClick: this.handleClick, dangerouslySetInnerHTML: { __html: html } });
	    }
	});
	module.exports = AutocompleteItemTemplate;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1);
	var Button = React.createClass({
	    displayName: 'Button',
	
	    getDefaultProps: function getDefaultProps() {
	        return {
	            action: 'Submit',
	            label: 'Submit',
	            buttonClass: 'btn',
	            handle: function handle() {}
	        };
	    },
	    getInitialState: function getInitialState() {
	        return {
	            disabled: this.props.disabled || false
	        };
	    },
	    setDisabled: function setDisabled(disabled) {
	        this.setState({ disabled: disabled });
	    },
	    handler: function handler(e) {
	        this.props.handler(e, this.props.action, this);
	    },
	    render: function render() {
	        return React.createElement(
	            'button',
	            { className: this.props.buttonClass, disabled: this.state.disabled,
	                onClick: this.handler },
	            this.props.label
	        );
	    }
	});
	module.exports = Button;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var React = __webpack_require__(1);
	
	var CheckboxTemplate = React.createClass({
	    displayName: "CheckboxTemplate",
	
	    render: function render() {
	        return React.createElement(
	            "div",
	            { className: "checkbox" },
	            React.createElement(
	                "label",
	                null,
	                this.props.children,
	                this.props.label
	            )
	        );
	    }
	});
	
	module.exports = CheckboxTemplate;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var React = __webpack_require__(1);
	var CheckboxesGroupTemplate = React.createClass({
	    displayName: "CheckboxesGroupTemplate",
	
	    render: function render() {
	        return React.createElement(
	            "fieldset",
	            { className: "group" },
	            React.createElement(
	                "legend",
	                null,
	                this.props.group
	            ),
	            this.props.children
	        );
	    }
	});
	module.exports = CheckboxesGroupTemplate;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(41);

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1);
	var Editor = __webpack_require__(10);
	
	var CollectionCreateTemplate = React.createClass({
	    displayName: 'CollectionCreateTemplate',
	
	    render: function render() {
	        return React.createElement(
	            'div',
	            { className: 'panel panel-default' },
	            React.createElement(
	                'div',
	                { className: 'panel-heading' },
	                React.createElement(
	                    'h3',
	                    { className: 'panel-title clearfix ' },
	                    this.props.title
	                )
	            ),
	            React.createElement(
	                'div',
	                { className: 'panel-body' },
	                React.createElement(
	                    'div',
	                    { className: 'form-group' },
	                    React.createElement(Editor, { ref: 'itemEditor', field: this.props.field, value: this.props.value,
	                        valueManager: this.props.valueManager,
	                        pid: this.props.editPid,
	                        form: null })
	                ),
	                React.createElement(
	                    'div',
	                    { className: 'form-group' },
	                    React.createElement(
	                        'button',
	                        { className: 'btn btn-default pull-left', ref: 'cancelBtn', onClick: this.props.onCancel },
	                        'Cancel'
	                    ),
	                    React.createElement(
	                        'button',
	                        { className: 'btn btn-primary pull-right', ref: 'submitBtn',
	                            onClick: this.props.onSubmit },
	                        this.props.submitButton
	                    )
	                )
	            )
	        );
	    }
	});
	module.exports = CollectionCreateTemplate;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1);
	var EditorTemplate = React.createClass({
	    displayName: 'EditorTemplate',
	    componentWillMount: function componentWillMount() {
	        this.props.valueManager.addErrorListener(this.props.path, this.setError, this, true);
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        this.props.valueManager.removeErrorListener(this.props.path, this.setError);
	    },
	    setError: function setError(errors) {
	        this.setState({
	            error: errors && errors[0].message
	        });
	    },
	    render: function render() {
	        var _props = this.props;
	        var name = _props.name;
	        var title = _props.title;
	        var help = _props.help;
	        var errorClassName = _props.errorClassName;
	        var message = _props.message;
	        var fieldClass = _props.fieldClass;
	        var children = _props.children;
	
	        var error = this.state.error;
	        return React.createElement(
	            'div',
	            {
	                className: 'form-group field-name ' + (error != null ? errorClassName : '') + ' ' + fieldClass },
	            title ? React.createElement(
	                'label',
	                { className: 'col-sm-2 control-label', htmlFor: name },
	                title
	            ) : null,
	            React.createElement(
	                'div',
	                { className: 'col-sm-10' },
	                children,
	                React.createElement(
	                    'p',
	                    { className: 'help-block', ref: 'help' },
	                    error || help
	                )
	            )
	        );
	    }
	});
	module.exports = EditorTemplate;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1);
	
	var FieldSetTemplate = React.createClass({
	    displayName: 'FieldSetTemplate',
	
	    render: function render() {
	        var f = this.props.field;
	        return f.legend ? React.createElement(
	            'fieldset',
	            null,
	            React.createElement(
	                'legend',
	                null,
	                f.legend
	            ),
	            this.props.children
	        ) : React.createElement(
	            'div',
	            null,
	            this.props.children
	        );
	    }
	
	});
	
	module.exports = FieldSetTemplate;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };
	
	var React = __webpack_require__(1);
	
	var FormTemplate = React.createClass({
	    displayName: 'FormTemplate',
	
	    render: function render() {
	        var _props = this.props;
	        var children = _props.children;
	
	        var props = _objectWithoutProperties(_props, ['children']);
	
	        return React.createElement(
	            'form',
	            props,
	            children
	        );
	    }
	});
	
	module.exports = FormTemplate;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1);
	var tpath = __webpack_require__(6).path;
	//var PropsStateValueMixin = require('../PropsStateValueMixin');
	var ListItemTemplate = React.createClass({
	    displayName: 'ListItemTemplate',
	
	    //    mixins: [require('../PropsStateValueMixin')],
	    getDefaultProps: function getDefaultProps() {
	        return {
	            type: 'Text',
	            onMoveUp: function onMoveUp() {},
	            onMoveDown: function onMoveDown() {},
	            onDelete: function onDelete() {},
	            onValidate: function onValidate() {},
	            onValueChange: function onValueChange() {},
	            onEdit: function onEdit() {},
	            last: false,
	            itemToString: function itemToString(v) {
	                return v != null ? v.toString() : '';
	            }
	        };
	    },
	    handleMoveUp: function handleMoveUp(e) {
	        e.preventDefault();
	        this.props.onMoveUp(this.props.pos, this.props.value, this.props.pid);
	    },
	    handleMoveDown: function handleMoveDown(e) {
	        e.preventDefault();
	        this.props.onMoveDown(this.props.pos, this.props.value, this.props.pid);
	    },
	    handleDelete: function handleDelete(e) {
	        e.preventDefault();
	        this.props.onDelete(this.props.pos, this.props.value, this.props.pid);
	    },
	    handleEdit: function handleEdit(e) {
	        e.preventDefault();
	        this.props.onEdit(this.props.pos, this.props.value, this.props.pid);
	    },
	    renderField: function renderField() {
	        var field = this.props.field,
	            content = this.props.itemToString(this.props.value);
	
	        if (field.canEdit) {
	            return React.createElement(
	                'span',
	                { className: 'item-value', ref: 'edit', onClick: this.handleEdit,
	                    path: tpath(this.props.path, this.props.pos) },
	                content
	            );
	        } else {
	            return React.createElement(
	                'span',
	                { className: 'item-value' },
	                content
	            );
	        }
	    },
	    render: function render() {
	        var _props = this.props;
	        var pos = _props.pos;
	        var field = _props.field;
	        var value = _props.value;
	        var errors = _props.errors;
	        var path = _props.path;
	        var onValidate = _props.onValidate;
	        var last = _props.last;
	        var onValueChange = _props.onValueChange;
	        var type = field.type;
	        var name = field.name;
	        var canReorder = field.canReorder;
	        var canDelete = field.canDelete;
	
	        var error = errors && errors[0] && errors[0].message;
	        var btnCls = 'btn btn-xs btn-default';
	        return React.createElement(
	            'li',
	            { className: 'list-group-item ' + (error ? 'has-error' : '') },
	            this.renderField(),
	            error ? React.createElement(
	                'p',
	                { ref: 'error', className: 'help-block' },
	                error
	            ) : null,
	            React.createElement(
	                'div',
	                { className: 'btn-group  pull-right' },
	                canReorder && pos > 0 ? React.createElement(
	                    'button',
	                    { onClick: this.handleMoveUp, ref: 'upBtn', className: btnCls,
	                        title: 'Move Up' },
	                    React.createElement('i', { className: 'glyphicon glyphicon-chevron-up' })
	                ) : null,
	                canReorder && !last ? React.createElement(
	                    'button',
	                    { onClick: this.handleMoveDown, ref: 'downBtn', className: btnCls,
	                        title: 'Move Down' },
	                    React.createElement('i', { className: 'glyphicon glyphicon-chevron-down' })
	                ) : null,
	                canDelete ? React.createElement(
	                    'button',
	                    { onClick: this.handleDelete, className: btnCls, ref: 'deleteBtn', title: 'Delete' },
	                    React.createElement('i', {
	                        className: 'glyphicon glyphicon-remove' })
	                ) : null
	            )
	        );
	    }
	
	});
	module.exports = ListItemTemplate;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };
	
	var React = __webpack_require__(1);
	
	var ObjectTemplate = React.createClass({
	    displayName: 'ObjectTemplate',
	
	    render: function render() {
	        var _props = this.props;
	        var children = _props.children;
	
	        var props = _objectWithoutProperties(_props, ['children']);
	
	        return React.createElement(
	            'div',
	            props,
	            children
	        );
	    }
	});
	
	module.exports = ObjectTemplate;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var React = __webpack_require__(1);
	var RadioItemTemplate = React.createClass({
	    displayName: "RadioItemTemplate",
	
	    render: function render() {
	        var _props = this.props;
	        var label = _props.label;
	        var labelHTML = _props.labelHTML;
	        var id = _props.id;
	
	        label = labelHTML ? React.createElement("span", { dangerouslySetInnerHTML: { __html: labelHTML } }) : label;
	
	        return React.createElement(
	            "div",
	            { className: "radio" },
	            React.createElement(
	                "label",
	                null,
	                this.props.children,
	                label
	            )
	        );
	    }
	});
	module.exports = RadioItemTemplate;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };
	
	var React = __webpack_require__(1);
	var Form = __webpack_require__(5);
	var tu = __webpack_require__(6);
	var NestedMixin = __webpack_require__(9);
	var css = __webpack_require__(88);
	var ButtonsTemplate = __webpack_require__(90);
	
	var Wizard = React.createClass({
	    displayName: 'Wizard',
	
	    getInitialState: function getInitialState() {
	        var _props = this.props;
	        var schema = _props.schema;
	        var subSchema = _props.subSchema;
	        var fields = _props.fields;
	
	        var props = _objectWithoutProperties(_props, ['schema', 'subSchema', 'fields']);
	
	        schema = NestedMixin.normalizeSchema(schema || subSchema);
	        this.schema = schema.schema ? schema : { schema: schema, fields: fields };
	        return {
	            compState: 0,
	            navState: this.getNavStates(0, this.schema.fieldsets.length),
	            values: []
	        };
	    },
	    componentWillMount: function componentWillMount() {
	        this.props.valueManager.addListener(this.props.path, this.setValue, this, true);
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        this.props.valueManager.removeListener(this.props.path, this.setValue, this, true);
	    },
	    setValue: function setValue(value) {
	        this.setState({ value: value });
	    },
	    getNavStates: function getNavStates(indx, length) {
	        var styles = [],
	            values = this.state && this.state.values || [];
	        for (var i = 0; i < length; i++) {
	            if (i < indx || indx == length) {
	                styles.push('done');
	            } else if (i === indx) {
	                styles.push('doing');
	            } else {
	                styles.push('todo');
	            }
	            if (values[i] && values[i].errors) {
	                styles[i] += ' error';
	            }
	        }
	        return { current: Math.min(indx, length - 1), styles: styles };
	    },
	    setNavState: function setNavState(next) {
	        var len = this.schema.fieldsets.length;
	        this.setState({ navState: this.getNavStates(next, len), compState: Math.min(len - 1, next) });
	    },
	
	    handleOnClick: function handleOnClick(evt) {
	        var steps = this.schema.fieldsets.length,
	            value = evt.target.value;
	        if (value < steps && value <= this.state.values.length) {
	            this.setNavState(value);
	        }
	    },
	
	    handleKeyDown: function handleKeyDown(e) {
	        if (e.which === 13) {
	            if (this.state.compState < this.schema.fieldsets.length - 1) {
	                return this.handleBtn(e, 'next');
	            } else {
	                return this.handleBtn(e, 'submit');
	            }
	        }
	    },
	    handleValidate: function handleValidate() {},
	    handleSubmit: function handleSubmit(e, errors, value) {
	        this.props.onSubmit(e, errors, value);
	    },
	
	    renderState: function renderState(compState) {
	        var schema = tu.extend({}, this.schema.schema);
	        var fields = this.schema.fieldsets[compState].fields;
	
	        return React.createElement(
	            Form,
	            { ref: 'form', schema: {
	                    schema: schema,
	                    fields: fields
	                }, onSubmit: this.handleSubmit,
	                valueManager: this.props.valueManager },
	            this.renderBtns(compState)
	        );
	    },
	    renderBtns: function renderBtns(compState) {
	        var buttons = this.schema.fieldsets[compState].buttons;
	        if (!buttons && buttons !== false) {
	            buttons = [];
	            var isFirst = compState === 0,
	                isLast = compState === this.schema.fieldsets.length - 1;
	            if (!isFirst) {
	                buttons.push({
	                    label: 'Previous',
	                    action: 'previous'
	                });
	            }
	            if (isLast) {
	                buttons.push({
	                    label: 'Done',
	                    action: 'submit',
	                    buttonClass: 'btn-primary'
	                });
	            } else {
	                buttons.push({
	                    label: 'Next',
	                    action: 'next',
	                    buttonClass: 'btn-primary'
	                });
	            }
	        }
	        return React.createElement(ButtonsTemplate, { buttons: buttons, handler: this.handleBtn });
	    },
	    handleBtn: function handleBtn(e, action, btn) {
	        e && e.preventDefault();
	        var form = this.refs.form;
	
	        switch (action) {
	
	            case 'previous':
	                {
	                    this.setNavState(this.state.compState - 1);
	                    break;
	                }
	            case 'next':
	                {
	                    var errors = this.props.valueManager.validate(),
	                        compState = this.state.compState;
	                    this.state.values[compState] = { value: form.getValue(), errors: errors };
	                    if (!errors) {
	                        this.setNavState(compState + 1);
	                    } else {
	                        this.setNavState(compState);
	                    }
	                    break;
	                }
	            case 'submit':
	                {
	                    var errors = this.props.valueManager.validate();
	                    this.state.values[this.state.compState] = { value: form.getValue(), errors: errors };
	                    var data = {};
	                    this.state.values.forEach(function (v) {
	                        tu.extend(data, v.value);
	                    });
	                    this.setNavState(this.state.compState + 1);
	                    this.handleSubmit(e, errors, data);
	                    break;
	                }
	        }
	    },
	    render: function render() {
	        var _this = this;
	
	        var fieldsets = this.schema.fieldsets;
	        return React.createElement(
	            'div',
	            { className: 'container', onKeyDown: this.handleKeyDown },
	            React.createElement(
	                'ol',
	                { className: 'progtrckr' },
	                fieldsets.map(function (s, i) {
	                    return React.createElement(
	                        'li',
	                        { value: i, key: i,
	                            className: 'progtrckr-' + _this.state.navState.styles[i],
	                            onClick: _this.handleOnClick },
	                        React.createElement(
	                            'em',
	                            null,
	                            i + 1
	                        ),
	                        React.createElement(
	                            'span',
	                            null,
	                            s.legend
	                        )
	                    );
	                })
	            ),
	            this.renderState(this.state.compState)
	        );
	    }
	});
	
	module.exports = Wizard;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	var tu = __webpack_require__(6);
	var loader = __webpack_require__(12);
	
	var ButtonsTemplate = React.createClass({
	    displayName: 'ButtonsTemplate',
	
	    getDefaultProps: function getDefaultProps() {
	        return {
	            buttonsClass: 'btn-group',
	            buttonClass: 'btn',
	            buttonTemplate: 'ButtonTemplate',
	            buttons: [{
	                action: 'Submit',
	                label: 'Submit',
	                template: 'Button'
	            }],
	            handler: function handler(event, action, btn) {}
	        };
	    },
	    makeButtons: function makeButtons() {
	        var _this = this;
	
	        var handler = this.props.handler;
	        return this.props.buttons.map(function (b) {
	            var btn = tu.isString(b) ? {
	                action: b,
	                label: b,
	                handler: handler
	            } : _.extend({}, b, { handler: handler });
	            if (_this.props.buttonClass) {
	                btn.buttonClass = (btn.buttonClass || '') + ' ' + _this.props.buttonClass;
	            }
	            btn.template = loader.loadTemplate(b.template || _this.props.buttonTemplate);
	            return btn;
	        });
	    },
	
	    render: function render() {
	        return React.createElement(
	            'div',
	            { className: 'form-group' },
	            React.createElement(
	                'div',
	                { className: 'col-sm-offset-2 col-sm-10' },
	                React.createElement(
	                    'div',
	                    { className: this.props.buttonsClass },
	                    this.makeButtons().map(function (b, i) {
	                        var Template = b.template;
	                        return React.createElement(Template, _extends({ key: 'btn-' + i }, b));
	                    })
	                )
	            )
	        );
	    }
	
	});
	
	module.exports = ButtonsTemplate;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports.editor = __webpack_require__(45);

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1);
	var tu = __webpack_require__(6);
	var css = __webpack_require__(91);
	var loader = __webpack_require__(12);
	var BasicFieldMixin = __webpack_require__(32);
	
	var Autocomplete = React.createClass({
	    displayName: 'Autocomplete',
	
	    mixins: [BasicFieldMixin],
	    propTypes: {
	        name: React.PropTypes.string.isRequired,
	        /* processor: React.PropTypes.shape({
	         fetch: React.PropTypes.func.isRequired
	         }).isRequired,*/
	        //optional
	        onChange: React.PropTypes.func,
	        onSelect: React.PropTypes.func,
	        minLength: React.PropTypes.number,
	        foundCls: React.PropTypes.string,
	        notFoundCls: React.PropTypes.string
	
	    },
	
	    getDefaultProps: function getDefaultProps() {
	        var self = this;
	        return {
	            country: 'US',
	            locale: 'en_US',
	            foundCls: 'found',
	            notFoundCls: 'notfound',
	            useshowing: true,
	            minLength: 1,
	            maxInputLength: 200,
	            itemTemplate: 'AutocompleteItemTemplate',
	            processor: {
	                fetch: function fetch(url, value, component, cb) {
	
	                    value = value.toLowerCase();
	                    var data = (component.props.field.options || []).map(function (v) {
	                        return {
	                            label: v.label || v.val || v,
	                            data: v,
	                            val: v.val || v.label || v
	                        };
	                    }).filter(function (v) {
	                        var l = v.val.toLowerCase(),
	                            v;
	
	                        if (l.indexOf(value) === 0) {
	                            return true;
	                        }
	
	                        //                        return v.indexOf(value) === 0;
	                    });
	
	                    cb(null, data);
	                },
	                value: function value(obj) {
	                    return obj == null ? null : obj.val || obj;
	                },
	                format: function format(v) {
	                    return v == null ? null : v.label || v;
	                }
	            },
	            onChange: function onChange(e) {},
	            onSelect: function onSelect(e) {},
	            showing: 'Searching...'
	        };
	    },
	    getInitialState: function getInitialState() {
	        return {
	            suggestions: [],
	            input: '',
	            showing: false,
	            focus: -1
	        };
	    },
	    getValue: function getValue() {
	        return this.state.value;
	    },
	    setValue: function setValue(v) {
	        var p = this.getProcessor();
	        var value = p.value(v);
	        var input = p.format(v);
	
	        this.setState({
	            value: value,
	            selected: v,
	            input: input,
	            showing: false,
	            suggestions: []
	        });
	    },
	    /**
	     * Hide could be called when a user has not selected a value.
	     *
	     * If their is a selected value and input equals its label select it.
	     * So if there is only 1 selection select it.
	     * If
	     */
	    hide: function hide() {
	        var _state = this.state;
	        var selected = _state.selected;
	        var input = _state.input;
	        var suggestions = _state.suggestions;var i = 0;var l;var options;var found = false;
	        var p = this.getProcessor();
	        if (input == null || input.trim() === '') {
	            selected = null;
	            input = null;
	        } else if (!selected || input !== selected.label) {
	            if (suggestions.length === 1) {
	                selected = suggestions[0];
	                input = selected.label;
	            } else {
	                selected = null;
	                options = suggestions;
	                l = options.length;
	                for (; i < l; i++) {
	                    var opt = options[i];
	                    if (opt.label === input) {
	                        selected = opt;
	                        input = opt.label;
	                        found = true;
	                        break;
	                    }
	                }
	                if (!found) {
	                    input = null;
	                }
	            }
	        }
	
	        this.props.onValidate(selected && selected.val, this.props.value, this.props.name, this.props.path);
	        this.setState({ suggestions: [], selected: selected, input: input, showing: false, focus: -1 });
	    },
	    removeListener: function removeListener() {
	        document.removeEventListener('click', this.hide);
	    },
	    addListener: function addListener() {
	        document.addEventListener('click', this.hide);
	    },
	
	    handleSuggestionClick: function handleSuggestionClick(o) {
	        this.onSelect(o);
	    },
	    onSelect: function onSelect(o) {
	        var p = this.getProcessor();
	        var value = p.value(o);
	        if (this.updateValue(value) !== false) {
	            this.setState({
	                suggestions: [],
	                showing: false,
	                focus: -1,
	                selected: o,
	                value: value,
	                input: p.format(o)
	            });
	        }
	    },
	    _handleDispatch: function _handleDispatch(value) {
	        if (this._fetch && this._fetch.cancel) {
	            this._fetch.cancel();
	        }
	        var setState = this.setState.bind(this);
	        this.setState({
	            input: value,
	            selected: null
	        });
	        this._fetch = this.getProcessor().fetch(this.props.url, value, this, function (err, suggestions) {
	            if (err) {
	                return;
	            }
	            setState({
	                suggestions: suggestions,
	                showing: true,
	                input: value
	            });
	        });
	    },
	
	    handleKeyUp: function handleKeyUp(e) {
	        var focus = this.state.focus,
	            s = this.state.suggestions;
	        if (s.length) {
	            var update = false;
	            switch (e.key || e.keyCode) {
	                case 'Up':
	                case 38:
	                case 'ArrowUp':
	                    {
	                        focus = Math.max(-1, focus - 1);
	                        update = true;
	                        break;
	                    }
	                case 40:
	                case 'Down':
	                case 'ArrowDown':
	                    {
	                        focus = Math.min(s.length, focus + 1);
	                        update = true;
	                        break;
	                    }
	                case 'Enter':
	                    {
	                        if (this.state.suggestions.length) {
	                            this.handleSuggestionClick(this.state.suggestions[Math.max(this.state.focus, 0)]);
	                            this.setState({ suggestions: [], showing: false, focus: -1 });
	
	                            return;
	                        }
	                        this.hide();
	                        break;
	                    }
	            }
	            if (update) {
	                //e.preventDefault();
	                this.setState({ focus: focus });
	            }
	        }
	    },
	    getProcessor: function getProcessor() {
	        var processor = this.props.field.processor;
	        if (processor) {
	            if (tu.isString(processor)) {
	                return loader.loadProcessor(processor);
	            } else {
	                return processor;
	            }
	        }
	        return this.props.processor;
	    },
	    renderSuggestions: function renderSuggestions() {
	        var suggestions = this.state.suggestions;
	        if (this.state.showing === false || suggestions.length === 0) {
	            this.removeListener();
	            return null;
	        }
	        this.addListener();
	        var _state2 = this.state;
	        var focus = _state2.focus;
	        var input = _state2.input;
	
	        var processor = this.getProcessor();
	        var handleSuggestionClick = this.handleSuggestionClick;
	        var CompleteItem = loader.loadTemplate(this.props.field.itemTemplate || this.props.itemTemplate);
	        return React.createElement(
	            'ul',
	            { className: 'list-group' },
	            suggestions.map(function (item, i) {
	                return React.createElement(CompleteItem, {
	                    key: item.val,
	                    focus: focus === i,
	                    value: input,
	                    ref: 'item_' + i,
	                    processor: processor,
	                    onSelect: handleSuggestionClick,
	                    data: item });
	            })
	        );
	    },
	
	    handleChange: function handleChange(e) {
	        this._handleDispatch(e.target.value);
	    },
	
	    handlePaste: function handlePaste(event) {
	        var items = event.clipboardData && event.clipboardData.items;
	        items && items[0] && items[0].getAsString(this._handleKey.bind(this));
	    },
	    handleBlur: function handleBlur(event) {
	        if (this.state.suggestions.length === 1 && !this.state.showing && !this.state.selected) {
	            this.handleSuggestionClick(this.state.suggestions[Math.max(0, this.state.focus)]);
	        } else {
	            this.handleInvalid();
	        }
	    },
	    handleInvalid: function handleInvalid() {},
	    render: function render() {
	        var suggestions = this.state.suggestions,
	            name = this.props.name,
	            className = 'autocomplete ' + (suggestions.length > 0 ? this.props.foundCls : this.props.notFoundCls);
	        return React.createElement(
	            'div',
	            { className: className },
	            React.createElement('input', {
	                ref: 'input',
	                onChange: this.handleChange,
	                onPaste: this.handlePaste,
	                onBlur: this.handleBlur,
	                onKeyUp: this.handleKeyUp,
	                type: 'text',
	                value: this.state.input,
	                name: name,
	                className: ' form-control ',
	
	                placeholder: this.props.placeholder
	            }),
	            this.renderSuggestions()
	        );
	    }
	
	});
	
	module.exports = Autocomplete;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1),
	    FieldMixin = __webpack_require__(8),
	    Constants = __webpack_require__(93);
	
	var Checkbox = React.createClass({
	    displayName: 'Checkbox',
	
	    mixins: [FieldMixin],
	    statics: {
	        inputClassName: '' //Constants.inputClassName
	    },
	    doChange: function doChange(e) {
	        var hasProp = ('value' in this.props);
	        this.updateValue(e.target.checked ? hasProp ? this.props.value : true : hasProp ? null : false);
	    },
	    render: function render() {
	        return React.createElement('input', { onBlur: this.handleValidate, onChange: this.doChange, id: this.props.name,
	            className: Constants.clz(Checkbox.inputClassName, this.props.editorClass), type: 'checkbox',
	            value: this.state.value,
	            checked: this.state.value,
	            title: this.props.title });
	    }
	});
	
	module.exports = Checkbox;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	var BasicFieldMixin = __webpack_require__(32);
	var tu = __webpack_require__(6);
	var loader = __webpack_require__(12);
	var Constants = __webpack_require__(93);
	
	var Checkboxes = React.createClass({
	    displayName: 'Checkboxes',
	
	    statics: {
	        inputClassName: Constants.inputCheckboxesClassName
	    },
	    mixins: [BasicFieldMixin],
	    getDefaultProps: function getDefaultProps() {
	        return {
	            title: '',
	            name: '',
	            placeholder: '',
	            dataType: this.dataType,
	            template: 'CheckboxesTemplate',
	            groupTemplate: 'CheckboxesGroupTemplate',
	            onValidate: function onValidate() {}
	        };
	    },
	
	    setValue: function setValue(value) {
	        this.setState({ value: value });
	    },
	
	    handleCheckChange: function handleCheckChange(e) {
	        var newValues = this.state.value || [];
	        if (e.target.checked) {
	            newValues.push(e.target.value);
	        } else {
	            newValues.splice(newValues.indexOf(e.target.value), 1);
	        }
	        this.props.valueManager.update(this.props.path, newValues);
	    },
	
	    _createCheckbox: function _createCheckbox(option, index, group, CheckboxTemplate) {
	
	        var id = tu.path(this.props.path, index, group);
	        var val = option.val;
	        var labelHTML = option.labelHTML;
	
	        var value = this.state.value;
	        var labelContent = labelHTML ? React.createElement('span', { dangerouslySetInnerHTML: { __html: labelHTML } }) : val;
	        var opts = {
	            onChange: this.handleCheckChange,
	            name: this.props.field.name,
	            checked: value ? !! ~value.indexOf(val) : false,
	            ref: id.replace(/\./g, '_'),
	            id: id,
	            value: val
	        };
	        return React.createElement(
	            CheckboxTemplate,
	            _extends({ label: labelContent }, opts),
	            React.createElement('input', _extends({ type: 'checkbox' }, opts))
	        );
	    },
	    _createGroup: function _createGroup(option, index, group, Template, CheckboxTemplate) {
	        return React.createElement(
	            Template,
	            { group: option.group },
	            this.makeOptions(option.options, group == null ? 0 : group, CheckboxTemplate)
	        );
	    },
	
	    /**
	     * Create the checkbox list HTML
	     * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
	     *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
	     * @return {String} HTML
	     */
	    makeOptions: function makeOptions(array, group) {
	        var _this = this;
	
	        array = array || [];
	        var name = this.props.field.name;
	        var CheckboxTemplate = loader.loadTemplate(this.props.template);
	        var CheckboxesGroupTemplate = loader.loadTemplate(this.props.groupTemplate);
	        return array.map(function (option, index) {
	            option = tu.isString(option) ? { val: option } : option;
	            return React.createElement(
	                'div',
	                {
	                    key: name + '-' + option.val + '-' + group },
	                option.group ? _this._createGroup(option, index, group ? group++ : 0, CheckboxesGroupTemplate, CheckboxTemplate) : _this._createCheckbox(option, index, group, CheckboxTemplate)
	            );
	        });
	    },
	
	    render: function render() {
	
	        return React.createElement(
	            'div',
	            {
	                className: Constants.clz(Checkboxes.inputClassName, this.props.editorClass) },
	            this.makeOptions(this.props.field.options, 1)
	        );
	    }
	});
	
	module.exports = Checkboxes;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1);
	var Editor = __webpack_require__(10);
	var loader = __webpack_require__(12);
	var Constants = __webpack_require__(93);
	var ValueManager = __webpack_require__(7);
	var BasicFieldMixin = __webpack_require__(32);
	var CollectionMixin = {
	    statics: {
	        collectionCreateTemplate: 'CollectionCreateTemplate',
	        listClassName: Constants.listClassName,
	        itemTemplate: 'ListItemTemplate'
	    },
	    mixins: [BasicFieldMixin],
	    getInitialState: function getInitialState() {
	        return {};
	    },
	
	    getItemEditorValue: function getItemEditorValue() {
	        return this.itemVM.getValue();
	    },
	
	    getValue: function getValue() {
	        return this.unwrap(this.state.wrapped);
	    },
	    setValue: function setValue(value) {
	        this.setState(this.wrap({ value: value }));
	    },
	    setErrors: function setErrors(errors) {
	        this.setState({ errors: errors });
	    },
	    handleMoveUp: function handleMoveUp(pos, val) {
	        var values = this.state.wrapped,
	            oval = values && values.concat();
	        values.splice(Math.max(pos - 1, 0), 0, values.splice(pos, 1)[0]);
	        this.changeValue(values, oval);
	    },
	    handleMoveDown: function handleMoveDown(pos, val) {
	        var values = this.state.wrapped,
	            oval = values && values.concat();
	        values.splice(Math.min(pos + 1, values.length), 0, values.splice(pos, 1)[0]);
	        this.changeValue(values, oval);
	    },
	    handleDelete: function handleDelete(pos, val, pid) {
	        var values = this.state.wrapped,
	            oval = values && values.concat();
	        values.splice(pos, 1);
	        this.changeValue(values, oval);
	    },
	    handleEdit: function handleEdit(pos, val, pid) {
	        this.setState({
	            showAdd: false,
	            showEdit: true,
	            editPid: pid,
	            editValue: this.cloneVal(val)
	        });
	    },
	
	    changeValue: function changeValue(newValue, oldValue) {
	        if (this.updateValue(this.unwrap(newValue)) !== false) {
	
	            this.setState({
	                wrapped: newValue,
	                showAdd: false,
	                showEdit: false,
	                editValue: null
	            });
	        }
	    },
	    handleAddBtn: function handleAddBtn(e) {
	        e && e.preventDefault();
	        this.setState({ showAdd: true, editValue: null });
	    },
	    handleCancelAdd: function handleCancelAdd(e) {
	        e && e.preventDefault();
	        this.setState({ showAdd: false, showEdit: false, editValue: null });
	    },
	    handleAddValue: function handleAddValue(e) {
	        e && e.preventDefault();
	        this.addValue(this.getItemEditorValue());
	    },
	    handleEditValue: function handleEditValue(e) {
	        e && e.preventDefault();
	        var value = this.state.wrapped,
	            oval = value && value.concat(),
	            editPid = this.state.editPid,
	            nv = this.getItemEditorValue();
	        value.some(function (v, i) {
	            if (v.id === editPid) {
	                v.value = nv;
	                return true;
	            }
	        });
	        this.changeValue(value, oval);
	    },
	
	    addValue: function addValue(newValue) {
	        var values = this.state.wrapped || [],
	            oval = values && values.concat();
	        values.push({
	            id: newValue.key || values.length,
	            value: newValue
	        });
	        this.changeValue(values, oval);
	    },
	
	    renderAddEditTemplate: function renderAddEditTemplate(edit, create) {
	        var handler,
	            label = '';
	        if (edit) {
	            handler = this.handleEditValue;
	            label = 'Save';
	        } else if (create) {
	            handler = this.handleAddValue;
	            label = 'Create';
	        } else {
	            return null;
	        }
	        var value = this.state.editValue || (this.state.editValue = {});
	        /*return <div className="panel-body">
	         <div className="form-group">
	         <Editor ref="itemEditor" field={this.getTemplateItem()} value={value}
	         pid={this.state.editPid}
	         form={null}/>
	         </div>
	         <div className="form-group">
	         <button className="btn btn-default pull-left" ref="cancelBtn" onClick={this.handleCancelAdd}>Cancel
	         </button>
	         <button className="btn btn-primary pull-right" ref={create ? 'createBtn' : 'editBtn'}
	         onClick={handler}>{label}</button>
	         </div>
	         </div>*/
	        var CreateTemplate = loader.loadTemplate(this.props.collectionCreateTemplate);
	        var title = this.props.title || '';
	        this.itemVM = new ValueManager(this.state.editValue);
	        return React.createElement(CreateTemplate, { editPid: this.state.editPid, field: this.getTemplateItem(),
	            ref: 'addEdit',
	            valueManager: this.itemVM,
	            title: create ? 'Create ' + title : 'Edit ' + title,
	            submitButton: label,
	            onCancel: this.handleCancelAdd,
	            onSubmit: handler });
	    },
	    renderAddBtn: function renderAddBtn() {
	        if (!this.props.field.canAdd) {
	            return null;
	        }
	        return React.createElement(
	            'div',
	            { className: 'clearfix' },
	            React.createElement(
	                'button',
	                { className: 'btn btn-xs pull-right btn-default', ref: 'addBtn', onClick: this.handleAddBtn },
	                React.createElement('i', {
	                    className: 'icon-add' }),
	                'Add'
	            )
	        );
	    },
	
	    renderAdd: function renderAdd() {
	        var field = this.props.field;
	        if (!(field.canAdd || field.canEdit)) {
	            return null;
	        }
	        var _state = this.state;
	        var showAdd = _state.showAdd;
	        var showEdit = _state.showEdit;
	
	        return showAdd || showEdit ? this.renderAddEditTemplate(showEdit, showAdd) : this.renderAddBtn();
	    }
	};
	module.exports = CollectionMixin;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1),
	    FieldMixin = __webpack_require__(8),
	    Constants = __webpack_require__(93);
	
	var DateInput = React.createClass({
	    displayName: 'DateInput',
	
	    mixins: [FieldMixin],
	    statics: {
	        inputClassName: Constants.inputClassName
	    },
	    render: function render() {
	        return React.createElement('input', { onBlur: this.handleValidate, onChange: this.handleChange, id: this.props.name,
	            className: Constants.clz(DateInput.inputClassName, this.props.editorClass), type: 'date',
	            value: this.getValue(),
	            title: this.props.title, placeholder: this.props.placeholder });
	    }
	});
	
	module.exports = DateInput;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1),
	    FieldMixin = __webpack_require__(8),
	    Constants = __webpack_require__(93);
	
	var DateTimeInput = React.createClass({
	    displayName: 'DateTimeInput',
	
	    mixins: [FieldMixin],
	    statics: {
	        inputClassName: Constants.inputClassName
	    },
	    render: function render() {
	        return React.createElement('input', { onBlur: this.handleValidate, onChange: this.handleChange, id: this.props.name,
	            className: Constants.clz(DateTimeInput.inputClassName, this.props.editorClass), type: 'datetime',
	            value: this.getValue(),
	            title: this.props.title, placeholder: this.props.placeholder });
	    }
	});
	
	module.exports = DateTimeInput;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1),
	    FieldMixin = __webpack_require__(8),
	    Constants = __webpack_require__(93);
	
	var HiddenInput = React.createClass({
	    displayName: 'HiddenInput',
	
	    mixins: [FieldMixin],
	    statics: {
	        inputClassName: Constants.inputClassName
	    },
	    render: function render() {
	        return React.createElement('input', { id: this.props.name,
	            className: Constants.clz(HiddenInput.inputClassName, this.props.editorClass), type: 'hidden',
	            value: this.getValue(),
	            'data-path': this.props.path });
	    }
	});
	
	module.exports = HiddenInput;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1);
	var Constants = __webpack_require__(93);
	var tu = __webpack_require__(6);
	var CollectionMixin = __webpack_require__(57);
	var loader = __webpack_require__(12);
	var ListInput = React.createClass({
	    displayName: 'ListInput',
	
	    mixins: [CollectionMixin],
	    getDefaultProps: function getDefaultProps() {
	        return {
	
	            title: '',
	            placeholder: '',
	            itemType: 'Text',
	            onValueChange: function onValueChange() {},
	            onValidate: function onValidate() {},
	            itemTemplate: 'ListItemTemplate',
	            collectionCreateTemplate: this.collectionCreateTemplate
	
	        };
	    },
	
	    unwrap: function unwrap(value) {
	        var ret = (value || []).map(function (v, i) {
	            return v && v.value && v.value.value;
	        });
	        return ret;
	    },
	
	    wrap: function wrap(prop) {
	        var value = prop && prop.value || [];
	        var wrapped = value.map(function (v, k) {
	            return {
	                id: k,
	                value: {
	                    value: value[k]
	                }
	            };
	        });
	        return {
	            wrapped: wrapped
	        };
	    },
	    cloneVal: function cloneVal(val) {
	        return {
	            value: tu.clone(val)
	        };
	    },
	    itemToString: function itemToString() {
	        if (this.props.itemToString) {
	            return this.props.itemToString;
	        } else if (this.props.field.labelKey) {
	            var labelKey = this.props.field.labelKey;
	            return function (v) {
	                if (!v) {
	                    return null;
	                }
	                return React.createElement(
	                    'span',
	                    { className: 'brf-value list-group-item-text' },
	                    v[labelKey] || ''
	                );
	            };
	        }
	        return function (v) {
	            return v && v.toString();
	        };
	    },
	    /* unwrap:function(value){
	     if (value == null) return [];
	     return value.map(this.extractValue);
	     },*/
	    getTemplateItem: function getTemplateItem() {
	        return {
	            type: 'Object',
	            name: this.props.field.name,
	            title: this.props.field.title,
	            subSchema: {
	                value: this.props.field.itemType || this.props.itemType
	            },
	            fields: ['value']
	        };
	    },
	    render: function render() {
	        var _this = this;
	
	        var _props = this.props;
	        var name = _props.name;
	        var itemTemplate = _props.itemTemplate;
	        var itemType = _props.itemType;
	        var errors = _props.errors;
	        var path = _props.path;
	        var field = _props.field;var item = !itemType || tu.isString(itemType) ? {
	            type: itemType || 'Text',
	            name: name
	        } : itemType;var ListItemTemplate = loader.loadTemplate(itemTemplate);var values = this.state.wrapped || [];var length = values.length;
	        item.canReorder = field.canReorder;
	        item.canDelete = field.canDelete;
	        item.canEdit = field.canEdit;
	        item.canAdd = field.canAdd;
	        this._item = item;
	        var err = this.state.errors || {};
	        var itemToString = this.itemToString();
	        return React.createElement(
	            'div',
	            { className: Constants.clz(ListInput.inputClassName, this.props.editorClass, 'list-editor') },
	            this.renderAdd(),
	            React.createElement(
	                'ul',
	                { className: Constants.clz(ListInput.inputListClassName) },
	                values.map(function (v, i) {
	                    var lipath = tu.path(path, v.id);
	                    return React.createElement(ListItemTemplate, { ref: name + '_' + i, key: 'li-' + name + '-' + v.id, pos: i,
	                        onMoveUp: _this.handleMoveUp,
	                        itemToString: itemToString,
	                        onMoveDown: _this.handleMoveDown, onDelete: _this.handleDelete,
	                        onEdit: _this.handleEdit,
	                        field: item,
	                        path: lipath,
	                        errors: err && err[lipath],
	                        pid: v.id,
	                        value: v.value.value, last: i + 1 === length });
	                })
	            )
	        );
	    }
	
	});
	module.exports = ListInput;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1);
	var CollectionMixin = __webpack_require__(57);
	var tu = __webpack_require__(6);
	var loader = __webpack_require__(12);
	var Constants = __webpack_require__(93);
	var MixedInput = React.createClass({
	    displayName: 'MixedInput',
	
	    mixins: [CollectionMixin],
	    getDefaultProps: function getDefaultProps() {
	        return {
	            placeholder: '',
	            itemType: 'Text',
	            keyType: 'Text',
	            valueType: 'Text',
	            onValueChange: function onValueChange() {},
	            onValidate: function onValidate() {},
	            itemTemplate: this.itemTemplate,
	            collectionCreateTemplate: this.collectionCreateTemplate
	        };
	    },
	
	    unwrap: function unwrap(value) {
	        var ret = {};
	        if (value == null) {
	            return ret;
	        }
	        value.forEach(function (v) {
	            v = v.value;
	            ret[v.key] = v.value;
	        });
	        return ret;
	    },
	
	    wrap: function wrap(prop) {
	        var value = prop && prop.value || {};
	        var wrapped = Object.keys(value).map(function (k) {
	            return {
	                id: k,
	                value: {
	                    key: k,
	                    value: value[k]
	                }
	            };
	        });
	        return {
	            wrapped: wrapped
	        };
	    },
	    itemToString: function itemToString() {
	        if (this.props.itemToString) {
	            return this.props.itemToString;
	        } else if (this.props.field.labelKey) {
	            var labelKey = this.props.field.labelKey;
	            return function (v) {
	                if (!(v && v.key)) {
	                    return null;
	                }
	                return React.createElement(
	                    'span',
	                    null,
	                    React.createElement(
	                        'h4',
	                        { className: 'brf-key list-group-item-heading' },
	                        v.key
	                    ),
	                    React.createElement(
	                        'span',
	                        {
	                            className: 'brf-value list-group-item-text' },
	                        v.value && v.value[labelKey] || ''
	                    )
	                );
	            };
	        }
	        return null;
	    },
	    cloneVal: function cloneVal(val) {
	        return tu.clone(val);
	    },
	    uniqueCheck: function uniqueCheck(value) {
	        var values = this.getValue();
	        if (this.state.editPid == value) {
	            return null;
	        }
	        if (value in values) {
	
	            return {
	                message: 'Keys must be unique'
	            };
	        }
	        return null;
	    },
	    getTemplateItem: function getTemplateItem() {
	        var kt = this.props.field.keyType,
	            keyType = tu.isString(kt) ? {
	            type: kt
	        } : kt || {},
	            validators = keyType.validators || (keyType.validators = []),
	            item = {
	            type: 'Object',
	            name: this.props.field.name,
	            subSchema: {
	                key: keyType,
	                value: this.props.field.valueType || this.props.valueType
	            },
	            fields: ['key', 'value']
	        };
	
	        if (!keyType.type) {
	            keyType.type = this.props.keyType;
	        }
	
	        validators.unshift('required', this.uniqueCheck);
	
	        return item;
	    },
	    render: function render() {
	        var _this = this;
	
	        var _props = this.props;
	        var name = _props.name;
	        var itemTemplate = _props.itemTemplate;
	        var itemType = _props.itemType;
	        var errors = _props.errors;
	        var path = _props.path;
	        var field = _props.field;var item = !itemType || tu.isString(itemType) ? {
	            type: itemType || 'Text',
	            name: name
	        } : itemType;var ListItemTemplate = loader.loadTemplate(itemTemplate);var values = this.state.wrapped || [];var length = values.length;
	        item.canReorder = field.canReorder;
	        item.canDelete = field.canDelete;
	        item.canEdit = field.canEdit;
	        var itemToString = this.itemToString();
	        return React.createElement(
	            'div',
	            { className: Constants.clz(MixedInput.inputClassName, this.props.editorClass, 'list-editor') },
	            this.renderAdd(),
	            React.createElement(
	                'ul',
	                { className: Constants.clz(MixedInput.inputListClassName) },
	                values.map(function (v, i) {
	                    var path = tu.path(path, v.id);
	                    return React.createElement(ListItemTemplate, { key: path, pos: i, path: path,
	                        onMoveUp: _this.handleMoveUp,
	                        onMoveDown: _this.handleMoveDown, onDelete: _this.handleDelete,
	                        onEdit: _this.handleEdit,
	                        field: item,
	                        pid: v.id,
	                        itemToString: itemToString,
	                        value: v.value, errors: errors, last: i + 1 === length });
	                })
	            )
	        );
	    }
	
	});
	
	module.exports = MixedInput;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	var NestedMixin = __webpack_require__(9);
	var loader = __webpack_require__(12);
	var BasicFieldMixin = __webpack_require__(32);
	var ObjectInput = React.createClass({
	    mixins: [NestedMixin, BasicFieldMixin],
	    displayName: 'ObjectInput',
	    getDefaultProps: function getDefaultProps() {
	        return {
	            template: 'ObjectTemplate'
	        };
	    },
	    vm: function vm() {
	        return this.props.valueManager;
	    },
	    render: function render() {
	        var _props = this.props;
	        var field = _props.field;
	        var value = _props.value;
	        var template = _props.template;
	
	        var props = _objectWithoutProperties(_props, ['field', 'value', 'template']);
	
	        var schema = field.schema;
	        var subSchema = field.subSchema;
	
	        schema = schema || subSchema;
	        schema = this.normalizeSchema(schema);
	
	        this.schema = schema.schema ? schema : { schema: schema, fields: field.fields };
	
	        var obj = {};
	        obj.value = this.getValue();
	        var Template = loader.loadTemplate(template);
	        return React.createElement(
	            Template,
	            _extends({}, obj, props),
	            this.schema && this.schema.schema ? this.renderSchema(this.props.form) : null
	        );
	    }
	
	});
	module.exports = ObjectInput;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1),
	    FieldMixin = __webpack_require__(8),
	    Constants = __webpack_require__(93);
	
	var Password = React.createClass({
	    displayName: 'Password',
	
	    mixins: [FieldMixin],
	    statics: {
	        inputClassName: Constants.inputClassName
	    },
	    render: function render() {
	        return React.createElement('input', { id: this.props.name, onBlur: this.handleValidate, onChange: this.handleChange,
	            className: Constants.clz(Password.inputClassName, this.props.editorClass), type: 'password',
	            value: this.getValue(), title: this.props.title,
	            placeholder: this.props.placeholder });
	    }
	
	});
	module.exports = Password;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	var tu = __webpack_require__(6);
	var loader = __webpack_require__(12);
	var BasicFieldMixin = __webpack_require__(32);
	
	var RadioInput = React.createClass({
	    displayName: 'Radio',
	    propTypes: {
	        title: React.PropTypes.string
	    },
	    mixins: [BasicFieldMixin],
	    getDefaultProps: function getDefaultProps() {
	        return {
	            title: '',
	            name: '',
	            placeholder: '',
	            template: 'RadioItemTemplate'
	        };
	    },
	    setValue: function setValue(value) {
	        this.setState({ value: value });
	    },
	
	    getValue: function getValue() {
	        return this.state.value;
	    },
	
	    _compare: function _compare(val, val2) {
	        if (val == null && val2 == null) {
	            return true;
	        }
	        if (val == null || val2 == null) {
	            return false;
	        }return '' + val === '' + val2;
	    },
	    handleCheckChange: function handleCheckChange(e) {
	        //Make a radio behave like a checkbox when there is only 1.
	        if (this.props.field.forceSelection === false || this.props.field.options && this.props.field.options.length === 1) {
	            this.updateValue(this._compare(e.target.value, this.state.value) ? null : e.target.value);
	        } else {
	            this.updateValue(e.target.value);
	        }
	    },
	    makeOptions: function makeOptions(options) {
	        var _this = this;
	
	        options = options || [];
	        var onChange = this.handleCheckChange;
	        var value = this.getValue();
	        var path = this.props.path;
	        return options.map(function (option, index) {
	            var _ref = tu.isString(option) ? { val: option, label: option } : option;
	
	            var val = _ref.val;
	            var label = _ref.label;
	            var labelHTML = _ref.labelHTML;
	
	            if (val == null) {
	                val = label;
	            }
	            if (label == null) {
	                label = val;
	            }
	            var path = option.path = tu.path(path, index);
	
	            return {
	                val: val,
	                path: path,
	                label: label,
	                labelHTML: labelHTML,
	                onChange: onChange,
	                checked: _this._compare(value, val)
	            };
	        });
	    },
	    render: function render() {
	        var _props = this.props;
	        var name = _props.name;
	        var template = _props.template;
	        var path = _props.path;
	        var dataType = _props.dataType;
	        var field = _props.field;
	
	        var RadioItemTemplate = loader.loadTemplate(template);
	        var options = this.makeOptions(field.options);
	        return React.createElement(
	            'div',
	            null,
	            options.map(function (option, index) {
	                return React.createElement(
	                    RadioItemTemplate,
	                    _extends({}, option, { key: option.path }),
	                    React.createElement('input', _extends({ id: fp, type: 'radio',
	                        name: name }, option, { value: option.val }))
	                );
	            }, this)
	        );
	    }
	});
	
	module.exports = RadioInput;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1),
	    FieldMixin = __webpack_require__(8),
	    Constants = __webpack_require__(93);
	
	var RestrictedInput = React.createClass({
	    displayName: 'RestrictedInput',
	
	    mixins: [FieldMixin],
	    statics: {
	        inputClassName: Constants.inputClassName
	    },
	    handleRestrictedChange: function handleRestrictedChange(e) {},
	    render: function render() {
	        return React.createElement(
	            'div',
	            null,
	            this.props.field.patternText ? React.createElement(
	                'div',
	                { className: 'patternText' },
	                this.props.field.patternText
	            ) : null,
	            React.createElement('input', { ref: 'input', onBlur: this.handleValidate, onChange: this.handleRestrictedChange, id: this.props.name,
	                className: Constants.clz(TextInput.inputClassName, this.props.editorClass),
	                type: this.props.dataType,
	                value: this.getValue(),
	                'data-path': this.props.path,
	                title: this.props.title, placeholder: this.props.placeholder })
	        );
	    }
	});
	
	module.exports = RestrictedInput;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1),
	    FieldMixin = __webpack_require__(8),
	    Constants = __webpack_require__(93);
	
	var SelectInput = React.createClass({
	    displayName: 'SelectInput',
	
	    mixins: [FieldMixin],
	    statics: {
	        inputClassName: Constants.inputClassName
	    },
	    render: function render() {
	        var _props = this.props;
	        var field = _props.field;
	        var name = _props.name;
	
	        var value = this.state.value;
	        var title = field.title;
	        var placeholder = field.placeholder;
	
	        var opts = this.props.field.options || [];
	        var hasValue = opts.some(function (v) {
	            return v === value || v.val === value;
	        }) || value == null;
	
	        return React.createElement(
	            'select',
	            { className: Constants.clz(SelectInput.inputClassName, this.props.editorClass),
	                onBlur: this.handleValidate, onChange: this.handleChange,
	                name: name, value: this.getValue(), title: title
	            },
	            hasValue ? React.createElement(
	                'option',
	                { key: 's' + opts.length, value: null },
	                this.props.placeholder
	            ) : null,
	            opts.map(function (o, i) {
	                if (value == null && (o == null || o.val == null)) {
	                    hasValue = true;
	                }
	                return React.createElement(
	                    'option',
	                    { key: 's' + i, value: o.val || o },
	                    o.label || o
	                );
	            })
	        );
	    }
	
	});
	module.exports = SelectInput;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1),
	    FieldMixin = __webpack_require__(8),
	    Constants = __webpack_require__(93);
	
	var TextInput = React.createClass({
	    displayName: 'TextInput',
	
	    mixins: [FieldMixin],
	    statics: {
	        inputClassName: Constants.inputClassName
	    },
	    render: function render() {
	        return React.createElement('input', { ref: 'input', onBlur: this.handleValidate, onChange: this.handleChange, id: this.props.name,
	            className: Constants.clz(TextInput.inputClassName, this.props.editorClass), type: this.props.dataType,
	            value: this.getValue(),
	            'data-path': this.props.path,
	            title: this.props.title, placeholder: this.props.placeholder });
	    }
	});
	
	module.exports = TextInput;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(1),
	    FieldMixin = __webpack_require__(8),
	    Constants = __webpack_require__(93);
	
	var TextArea = React.createClass({
	    displayName: 'TextArea',
	
	    mixins: [FieldMixin],
	    statics: {
	        inputClassName: Constants.inputClassName
	    },
	    render: function render() {
	        return React.createElement('textarea', { onBlur: this.handleValidate, onChange: this.handleChange, id: this.props.name,
	            className: Constants.clz(TextArea.inputClassName, this.props.editorClass),
	            value: this.getValue(),
	            'data-path': this.props.path,
	            title: this.props.title, placeholder: this.props.placeholder });
	    }
	});
	
	module.exports = TextArea;

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var React = _interopRequire(__webpack_require__(1));
	
	var constants = _interopRequire(__webpack_require__(94));
	
	var BootstrapMixin = {
	  propTypes: {
	    bsClass: React.PropTypes.oneOf(Object.keys(constants.CLASSES)),
	    bsStyle: React.PropTypes.oneOf(Object.keys(constants.STYLES)),
	    bsSize: React.PropTypes.oneOf(Object.keys(constants.SIZES))
	  },
	
	  getBsClassSet: function getBsClassSet() {
	    var classes = {};
	
	    var bsClass = this.props.bsClass && constants.CLASSES[this.props.bsClass];
	    if (bsClass) {
	      classes[bsClass] = true;
	
	      var prefix = bsClass + "-";
	
	      var bsSize = this.props.bsSize && constants.SIZES[this.props.bsSize];
	      if (bsSize) {
	        classes[prefix + bsSize] = true;
	      }
	
	      var bsStyle = this.props.bsStyle && constants.STYLES[this.props.bsStyle];
	      if (this.props.bsStyle) {
	        classes[prefix + bsStyle] = true;
	      }
	    }
	
	    return classes;
	  },
	
	  prefixClass: function prefixClass(subClass) {
	    return constants.CLASSES[this.props.bsClass] + "-" + subClass;
	  }
	};
	
	module.exports = BootstrapMixin;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var React = _interopRequire(__webpack_require__(1));
	
	var domUtils = _interopRequire(__webpack_require__(72));
	
	// TODO: listen for onTransitionEnd to remove el
	function getElementsAndSelf(root, classes) {
	  var els = root.querySelectorAll("." + classes.join("."));
	
	  els = [].map.call(els, function (e) {
	    return e;
	  });
	
	  for (var i = 0; i < classes.length; i++) {
	    if (!root.className.match(new RegExp("\\b" + classes[i] + "\\b"))) {
	      return els;
	    }
	  }
	  els.unshift(root);
	  return els;
	}
	
	module.exports = {
	  _fadeIn: function _fadeIn() {
	    var els = undefined;
	
	    if (this.isMounted()) {
	      els = getElementsAndSelf(React.findDOMNode(this), ["fade"]);
	
	      if (els.length) {
	        els.forEach(function (el) {
	          el.className += " in";
	        });
	      }
	    }
	  },
	
	  _fadeOut: function _fadeOut() {
	    var els = getElementsAndSelf(this._fadeOutEl, ["fade", "in"]);
	
	    if (els.length) {
	      els.forEach(function (el) {
	        el.className = el.className.replace(/\bin\b/, "");
	      });
	    }
	
	    setTimeout(this._handleFadeOutEnd, 300);
	  },
	
	  _handleFadeOutEnd: function _handleFadeOutEnd() {
	    if (this._fadeOutEl && this._fadeOutEl.parentNode) {
	      this._fadeOutEl.parentNode.removeChild(this._fadeOutEl);
	    }
	  },
	
	  componentDidMount: function componentDidMount() {
	    if (document.querySelectorAll) {
	      // Firefox needs delay for transition to be triggered
	      setTimeout(this._fadeIn, 20);
	    }
	  },
	
	  componentWillUnmount: function componentWillUnmount() {
	    var els = getElementsAndSelf(React.findDOMNode(this), ["fade"]),
	        container = this.props.container && React.findDOMNode(this.props.container) || domUtils.ownerDocument(this).body;
	
	    if (els.length) {
	      this._fadeOutEl = document.createElement("div");
	      container.appendChild(this._fadeOutEl);
	      this._fadeOutEl.appendChild(React.findDOMNode(this).cloneNode(true));
	      // Firefox needs delay for transition to be triggered
	      setTimeout(this._fadeOut, 20);
	    }
	  }
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var React = _interopRequire(__webpack_require__(1));
	
	/**
	 * Get elements owner document
	 *
	 * @param {ReactComponent|HTMLElement} componentOrElement
	 * @returns {HTMLElement}
	 */
	function ownerDocument(componentOrElement) {
	  var elem = React.findDOMNode(componentOrElement);
	  return elem && elem.ownerDocument || document;
	}
	
	/**
	 * Shortcut to compute element style
	 *
	 * @param {HTMLElement} elem
	 * @returns {CssStyle}
	 */
	function getComputedStyles(elem) {
	  return ownerDocument(elem).defaultView.getComputedStyle(elem, null);
	}
	
	/**
	 * Get elements offset
	 *
	 * TODO: REMOVE JQUERY!
	 *
	 * @param {HTMLElement} DOMNode
	 * @returns {{top: number, left: number}}
	 */
	function getOffset(DOMNode) {
	  if (window.jQuery) {
	    return window.jQuery(DOMNode).offset();
	  }
	
	  var docElem = ownerDocument(DOMNode).documentElement;
	  var box = { top: 0, left: 0 };
	
	  // If we don't have gBCR, just use 0,0 rather than error
	  // BlackBerry 5, iOS 3 (original iPhone)
	  if (typeof DOMNode.getBoundingClientRect !== "undefined") {
	    box = DOMNode.getBoundingClientRect();
	  }
	
	  return {
	    top: box.top + window.pageYOffset - docElem.clientTop,
	    left: box.left + window.pageXOffset - docElem.clientLeft
	  };
	}
	
	/**
	 * Get elements position
	 *
	 * TODO: REMOVE JQUERY!
	 *
	 * @param {HTMLElement} elem
	 * @param {HTMLElement?} offsetParent
	 * @returns {{top: number, left: number}}
	 */
	function getPosition(elem, offsetParent) {
	  if (window.jQuery) {
	    return window.jQuery(elem).position();
	  }
	
	  var offset = undefined,
	      parentOffset = { top: 0, left: 0 };
	
	  // Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
	  if (getComputedStyles(elem).position === "fixed") {
	    // We assume that getBoundingClientRect is available when computed position is fixed
	    offset = elem.getBoundingClientRect();
	  } else {
	    if (!offsetParent) {
	      // Get *real* offsetParent
	      offsetParent = offsetParentFunc(elem);
	    }
	
	    // Get correct offsets
	    offset = getOffset(elem);
	    if (offsetParent.nodeName !== "HTML") {
	      parentOffset = getOffset(offsetParent);
	    }
	
	    // Add offsetParent borders
	    parentOffset.top += parseInt(getComputedStyles(offsetParent).borderTopWidth, 10);
	    parentOffset.left += parseInt(getComputedStyles(offsetParent).borderLeftWidth, 10);
	  }
	
	  // Subtract parent offsets and element margins
	  return {
	    top: offset.top - parentOffset.top - parseInt(getComputedStyles(elem).marginTop, 10),
	    left: offset.left - parentOffset.left - parseInt(getComputedStyles(elem).marginLeft, 10)
	  };
	}
	
	/**
	 * Get parent element
	 *
	 * @param {HTMLElement?} elem
	 * @returns {HTMLElement}
	 */
	function offsetParentFunc(elem) {
	  var docElem = ownerDocument(elem).documentElement;
	  var offsetParent = elem.offsetParent || docElem;
	
	  while (offsetParent && (offsetParent.nodeName !== "HTML" && getComputedStyles(offsetParent).position === "static")) {
	    offsetParent = offsetParent.offsetParent;
	  }
	
	  return offsetParent || docElem;
	}
	
	module.exports = {
	  ownerDocument: ownerDocument,
	  getComputedStyles: getComputedStyles,
	  getOffset: getOffset,
	  getPosition: getPosition,
	  offsetParent: offsetParentFunc
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * This file contains a modified version of:
	 * https://github.com/facebook/react/blob/v0.12.0/src/vendor/stubs/EventListener.js
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * TODO: remove in favour of solution provided by:
	 *  https://github.com/facebook/react/issues/285
	 */
	
	/**
	 * Does not take into account specific nature of platform.
	 */
	"use strict";
	
	var EventListener = {
	  /**
	   * Listen to DOM events during the bubble phase.
	   *
	   * @param {DOMEventTarget} target DOM element to register listener on.
	   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
	   * @param {function} callback Callback function.
	   * @return {object} Object with a `remove` method.
	   */
	  listen: function listen(target, eventType, callback) {
	    if (target.addEventListener) {
	      target.addEventListener(eventType, callback, false);
	      return {
	        remove: function remove() {
	          target.removeEventListener(eventType, callback, false);
	        }
	      };
	    } else if (target.attachEvent) {
	      target.attachEvent("on" + eventType, callback);
	      return {
	        remove: function remove() {
	          target.detachEvent("on" + eventType, callback);
	        }
	      };
	    }
	  }
	};
	
	module.exports = EventListener;

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var React = _interopRequire(__webpack_require__(1));
	
	var CustomPropTypes = _interopRequire(__webpack_require__(95));
	
	var domUtils = _interopRequire(__webpack_require__(72));
	
	module.exports = {
	  propTypes: {
	    container: CustomPropTypes.mountable
	  },
	
	  componentWillUnmount: function componentWillUnmount() {
	    this._unrenderOverlay();
	    if (this._overlayTarget) {
	      this.getContainerDOMNode().removeChild(this._overlayTarget);
	      this._overlayTarget = null;
	    }
	  },
	
	  componentDidUpdate: function componentDidUpdate() {
	    this._renderOverlay();
	  },
	
	  componentDidMount: function componentDidMount() {
	    this._renderOverlay();
	  },
	
	  _mountOverlayTarget: function _mountOverlayTarget() {
	    this._overlayTarget = document.createElement("div");
	    this.getContainerDOMNode().appendChild(this._overlayTarget);
	  },
	
	  _renderOverlay: function _renderOverlay() {
	    if (!this._overlayTarget) {
	      this._mountOverlayTarget();
	    }
	
	    var overlay = this.renderOverlay();
	
	    // Save reference to help testing
	    if (overlay !== null) {
	      this._overlayInstance = React.render(overlay, this._overlayTarget);
	    } else {
	      // Unrender if the component is null for transitions to null
	      this._unrenderOverlay();
	    }
	  },
	
	  _unrenderOverlay: function _unrenderOverlay() {
	    React.unmountComponentAtNode(this._overlayTarget);
	    this._overlayInstance = null;
	  },
	
	  getOverlayDOMNode: function getOverlayDOMNode() {
	    if (!this.isMounted()) {
	      throw new Error("getOverlayDOMNode(): A component must be mounted to have a DOM node.");
	    }
	
	    if (this._overlayInstance) {
	      return React.findDOMNode(this._overlayInstance);
	    }
	
	    return null;
	  },
	
	  getContainerDOMNode: function getContainerDOMNode() {
	    return React.findDOMNode(this.props.container) || domUtils.ownerDocument(this).body;
	  }
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Safe chained function
	 *
	 * Will only create a new function if needed,
	 * otherwise will pass back existing functions or null.
	 *
	 * @param {function} one
	 * @param {function} two
	 * @returns {function|null}
	 */
	"use strict";
	
	function createChainedFunction(one, two) {
	  var hasOne = typeof one === "function";
	  var hasTwo = typeof two === "function";
	
	  if (!hasOne && !hasTwo) {
	    return null;
	  }
	  if (!hasOne) {
	    return two;
	  }
	  if (!hasTwo) {
	    return one;
	  }
	
	  return function chainedFunction() {
	    one.apply(this, arguments);
	    two.apply(this, arguments);
	  };
	}
	
	module.exports = createChainedFunction;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	}

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var assignOwnDefaults = __webpack_require__(96),
	    assignWith = __webpack_require__(97),
	    attempt = __webpack_require__(98),
	    baseAssign = __webpack_require__(99),
	    baseToString = __webpack_require__(100),
	    baseValues = __webpack_require__(101),
	    escapeStringChar = __webpack_require__(102),
	    isError = __webpack_require__(103),
	    isIterateeCall = __webpack_require__(104),
	    keys = __webpack_require__(105),
	    reInterpolate = __webpack_require__(106),
	    templateSettings = __webpack_require__(107);
	
	/** Used to match empty string literals in compiled template source. */
	var reEmptyStringLeading = /\b__p \+= '';/g,
	    reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
	    reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
	
	/** Used to match [ES template delimiters](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-template-literal-lexical-components). */
	var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
	
	/** Used to ensure capturing order of template delimiters. */
	var reNoMatch = /($^)/;
	
	/** Used to match unescaped characters in compiled string literals. */
	var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
	
	/**
	 * Creates a compiled template function that can interpolate data properties
	 * in "interpolate" delimiters, HTML-escape interpolated data properties in
	 * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
	 * properties may be accessed as free variables in the template. If a setting
	 * object is provided it takes precedence over `_.templateSettings` values.
	 *
	 * **Note:** In the development build `_.template` utilizes
	 * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
	 * for easier debugging.
	 *
	 * For more information on precompiling templates see
	 * [lodash's custom builds documentation](https://lodash.com/custom-builds).
	 *
	 * For more information on Chrome extension sandboxes see
	 * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The template string.
	 * @param {Object} [options] The options object.
	 * @param {RegExp} [options.escape] The HTML "escape" delimiter.
	 * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
	 * @param {Object} [options.imports] An object to import into the template as free variables.
	 * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
	 * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
	 * @param {string} [options.variable] The data object variable name.
	 * @param- {Object} [otherOptions] Enables the legacy `options` param signature.
	 * @returns {Function} Returns the compiled template function.
	 * @example
	 *
	 * // using the "interpolate" delimiter to create a compiled template
	 * var compiled = _.template('hello <%= user %>!');
	 * compiled({ 'user': 'fred' });
	 * // => 'hello fred!'
	 *
	 * // using the HTML "escape" delimiter to escape data property values
	 * var compiled = _.template('<b><%- value %></b>');
	 * compiled({ 'value': '<script>' });
	 * // => '<b>&lt;script&gt;</b>'
	 *
	 * // using the "evaluate" delimiter to execute JavaScript and generate HTML
	 * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
	 * compiled({ 'users': ['fred', 'barney'] });
	 * // => '<li>fred</li><li>barney</li>'
	 *
	 * // using the internal `print` function in "evaluate" delimiters
	 * var compiled = _.template('<% print("hello " + user); %>!');
	 * compiled({ 'user': 'barney' });
	 * // => 'hello barney!'
	 *
	 * // using the ES delimiter as an alternative to the default "interpolate" delimiter
	 * var compiled = _.template('hello ${ user }!');
	 * compiled({ 'user': 'pebbles' });
	 * // => 'hello pebbles!'
	 *
	 * // using custom template delimiters
	 * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
	 * var compiled = _.template('hello {{ user }}!');
	 * compiled({ 'user': 'mustache' });
	 * // => 'hello mustache!'
	 *
	 * // using backslashes to treat delimiters as plain text
	 * var compiled = _.template('<%= "\\<%- value %\\>" %>');
	 * compiled({ 'value': 'ignored' });
	 * // => '<%- value %>'
	 *
	 * // using the `imports` option to import `jQuery` as `jq`
	 * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
	 * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
	 * compiled({ 'users': ['fred', 'barney'] });
	 * // => '<li>fred</li><li>barney</li>'
	 *
	 * // using the `sourceURL` option to specify a custom sourceURL for the template
	 * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
	 * compiled(data);
	 * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
	 *
	 * // using the `variable` option to ensure a with-statement isn't used in the compiled template
	 * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
	 * compiled.source;
	 * // => function(data) {
	 * //   var __t, __p = '';
	 * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
	 * //   return __p;
	 * // }
	 *
	 * // using the `source` property to inline compiled templates for meaningful
	 * // line numbers in error messages and a stack trace
	 * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
	 *   var JST = {\
	 *     "main": ' + _.template(mainText).source + '\
	 *   };\
	 * ');
	 */
	function template(string, options, otherOptions) {
	  // Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
	  // and Laura Doktorova's doT.js (https://github.com/olado/doT).
	  var settings = templateSettings.imports._.templateSettings || templateSettings;
	
	  if (otherOptions && isIterateeCall(string, options, otherOptions)) {
	    options = otherOptions = null;
	  }
	  string = baseToString(string);
	  options = assignWith(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);
	
	  var imports = assignWith(baseAssign({}, options.imports), settings.imports, assignOwnDefaults),
	      importsKeys = keys(imports),
	      importsValues = baseValues(imports, importsKeys);
	
	  var isEscaping,
	      isEvaluating,
	      index = 0,
	      interpolate = options.interpolate || reNoMatch,
	      source = "__p += '";
	
	  // Compile the regexp to match each delimiter.
	  var reDelimiters = RegExp(
	    (options.escape || reNoMatch).source + '|' +
	    interpolate.source + '|' +
	    (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
	    (options.evaluate || reNoMatch).source + '|$'
	  , 'g');
	
	  // Use a sourceURL for easier debugging.
	  var sourceURL = 'sourceURL' in options ? '//# sourceURL=' + options.sourceURL + '\n' : '';
	
	  string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
	    interpolateValue || (interpolateValue = esTemplateValue);
	
	    // Escape characters that can't be included in string literals.
	    source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
	
	    // Replace delimiters with snippets.
	    if (escapeValue) {
	      isEscaping = true;
	      source += "' +\n__e(" + escapeValue + ") +\n'";
	    }
	    if (evaluateValue) {
	      isEvaluating = true;
	      source += "';\n" + evaluateValue + ";\n__p += '";
	    }
	    if (interpolateValue) {
	      source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
	    }
	    index = offset + match.length;
	
	    // The JS engine embedded in Adobe products requires returning the `match`
	    // string in order to produce the correct `offset` value.
	    return match;
	  });
	
	  source += "';\n";
	
	  // If `variable` is not specified wrap a with-statement around the generated
	  // code to add the data object to the top of the scope chain.
	  var variable = options.variable;
	  if (!variable) {
	    source = 'with (obj) {\n' + source + '\n}\n';
	  }
	  // Cleanup code by stripping empty strings.
	  source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
	    .replace(reEmptyStringMiddle, '$1')
	    .replace(reEmptyStringTrailing, '$1;');
	
	  // Frame code as the function body.
	  source = 'function(' + (variable || 'obj') + ') {\n' +
	    (variable
	      ? ''
	      : 'obj || (obj = {});\n'
	    ) +
	    "var __t, __p = ''" +
	    (isEscaping
	       ? ', __e = _.escape'
	       : ''
	    ) +
	    (isEvaluating
	      ? ', __j = Array.prototype.join;\n' +
	        "function print() { __p += __j.call(arguments, '') }\n"
	      : ';\n'
	    ) +
	    source +
	    'return __p\n}';
	
	  var result = attempt(function() {
	    return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
	  });
	
	  // Provide the compiled function's source by its `toString` method or
	  // the `source` property as a convenience for inlining compiled templates.
	  result.source = source;
	  if (isError(result)) {
	    throw result;
	  }
	  return result;
	}
	
	module.exports = template;


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(108);


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var baseIsFunction = __webpack_require__(109),
	    isNative = __webpack_require__(110);
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/** Native method references. */
	var Uint8Array = isNative(Uint8Array = global.Uint8Array) && Uint8Array;
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	var isFunction = !(baseIsFunction(/x/) || (Uint8Array && !baseIsFunction(Uint8Array))) ? baseIsFunction : function(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return objToString.call(value) == funcTag;
	};
	
	module.exports = isFunction;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(111);
	
	/** `Object#toString` result references. */
	var stringTag = '[object String]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
	}
	
	module.exports = isString;


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(111);
	
	/** `Object#toString` result references. */
	var regexpTag = '[object RegExp]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `RegExp` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isRegExp(/abc/);
	 * // => true
	 *
	 * _.isRegExp('/abc/');
	 * // => false
	 */
	function isRegExp(value) {
	  return (isObjectLike(value) && objToString.call(value) == regexpTag) || false;
	}
	
	module.exports = isRegExp;


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(111);
	
	/** `Object#toString` result references. */
	var dateTag = '[object Date]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `Date` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isDate(new Date);
	 * // => true
	 *
	 * _.isDate('Mon April 23 2012');
	 * // => false
	 */
	function isDate(value) {
	  return isObjectLike(value) && objToString.call(value) == dateTag;
	}
	
	module.exports = isDate;


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(111);
	
	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a boolean primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isBoolean(false);
	 * // => true
	 *
	 * _.isBoolean(null);
	 * // => false
	 */
	function isBoolean(value) {
	  return value === true || value === false || (isObjectLike(value) && objToString.call(value) == boolTag);
	}
	
	module.exports = isBoolean;


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(112),
	    isNative = __webpack_require__(110),
	    isObjectLike = __webpack_require__(111);
	
	/** `Object#toString` result references. */
	var arrayTag = '[object Array]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;
	
	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};
	
	module.exports = isArray;


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(111);
	
	/** `Object#toString` result references. */
	var numberTag = '[object Number]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `Number` primitive or object.
	 *
	 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
	 * as numbers, use the `_.isFinite` method.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isNumber(8.4);
	 * // => true
	 *
	 * _.isNumber(NaN);
	 * // => true
	 *
	 * _.isNumber('8.4');
	 * // => false
	 */
	function isNumber(value) {
	  return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag);
	}
	
	module.exports = isNumber;


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var baseEach = __webpack_require__(113),
	    createFind = __webpack_require__(114);
	
	/**
	 * Iterates over elements of `collection`, returning the first element
	 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
	 * invoked with three arguments: (value, index|key, collection).
	 *
	 * If a property name is provided for `predicate` the created `_.property`
	 * style callback returns the property value of the given element.
	 *
	 * If a value is also provided for `thisArg` the created `_.matchesProperty`
	 * style callback returns `true` for elements that have a matching property
	 * value, else `false`.
	 *
	 * If an object is provided for `predicate` the created `_.matches` style
	 * callback returns `true` for elements that have the properties of the given
	 * object, else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias detect
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to search.
	 * @param {Function|Object|string} [predicate=_.identity] The function invoked
	 *  per iteration.
	 * @param {*} [thisArg] The `this` binding of `predicate`.
	 * @returns {*} Returns the matched element, else `undefined`.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney',  'age': 36, 'active': true },
	 *   { 'user': 'fred',    'age': 40, 'active': false },
	 *   { 'user': 'pebbles', 'age': 1,  'active': true }
	 * ];
	 *
	 * _.result(_.find(users, function(chr) {
	 *   return chr.age < 40;
	 * }), 'user');
	 * // => 'barney'
	 *
	 * // using the `_.matches` callback shorthand
	 * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
	 * // => 'pebbles'
	 *
	 * // using the `_.matchesProperty` callback shorthand
	 * _.result(_.find(users, 'active', false), 'user');
	 * // => 'fred'
	 *
	 * // using the `_.property` callback shorthand
	 * _.result(_.find(users, 'active'), 'user');
	 * // => 'barney'
	 */
	var find = createFind(baseEach);
	
	module.exports = find;


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	function classNames() {
		var classes = '';
		var arg;
	
		for (var i = 0; i < arguments.length; i++) {
			arg = arguments[i];
			if (!arg) {
				continue;
			}
	
			if ('string' === typeof arg || 'number' === typeof arg) {
				classes += ' ' + arg;
			} else if (Object.prototype.toString.call(arg) === '[object Array]') {
				classes += ' ' + classNames.apply(null, arg);
			} else if ('object' === typeof arg) {
				for (var key in arg) {
					if (!arg.hasOwnProperty(key) || !arg[key]) {
						continue;
					}
					classes += ' ' + key;
				}
			}
		}
		return classes.substr(1);
	}
	
	// safely export classNames in case the script is included directly on a page
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	}


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(89);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(38)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/jspears/WebstormProjects/subschema/node_modules/css-loader/index.js!/Users/jspears/WebstormProjects/subschema/node_modules/less-loader/index.js!/Users/jspears/WebstormProjects/subschema/src/styles/wizard.less", function() {
			var newContent = require("!!/Users/jspears/WebstormProjects/subschema/node_modules/css-loader/index.js!/Users/jspears/WebstormProjects/subschema/node_modules/less-loader/index.js!/Users/jspears/WebstormProjects/subschema/src/styles/wizard.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(76)();
	exports.push([module.id, "ol.progtrckr {\n  margin: 0;\n  padding-bottom: 2.2rem;\n  list-style-type: none;\n  display: table;\n  padding-left: 0;\n  padding-right: 0;\n  width: 100%;\n}\nol.progtrckr li {\n  text-align: center;\n  line-height: 4.5rem;\n  padding: 0 0.7rem;\n  cursor: pointer;\n  display: table-cell;\n}\nol.progtrckr li span {\n  padding: 0 1.5rem;\n}\n@media (max-width: 650px) {\n  .progtrckr li span {\n    display: none;\n  }\n}\n.progtrckr em {\n  display: none;\n  font-weight: 700;\n  padding-left: 1rem;\n}\n@media (max-width: 650px) {\n  .progtrckr em {\n    display: inline;\n  }\n}\nol.progtrckr li.progtrckr-todo {\n  color: silver;\n  border-bottom: 4px solid silver;\n}\nol.progtrckr li.progtrckr-doing {\n  color: black;\n  border-bottom: 4px solid #33C3F0;\n}\nol.progtrckr li.progtrckr-done {\n  color: black;\n  border-bottom: 4px solid #33C3F0;\n}\nol.progtrckr li:after {\n  content: \"\\00a0\\00a0\";\n}\nol.progtrckr li:before {\n  position: relative;\n  bottom: -3.7rem;\n  float: left;\n  left: 50%;\n}\nol.progtrckr li.progtrckr-todo:before {\n  content: \"\\039F\";\n  color: silver;\n  background-color: white;\n  width: 1.2em;\n  line-height: 1.4em;\n}\nol.progtrckr li.progtrckr-todo:hover:before {\n  color: #0FA0CE;\n}\nol.progtrckr li.progtrckr-doing:before {\n  content: \"\\2022\";\n  color: white;\n  background-color: #33C3F0;\n  width: 1.2em;\n  line-height: 1.2em;\n  border-radius: 1.2em;\n}\nol.progtrckr li.progtrckr-doing:hover:before {\n  color: #0FA0CE;\n}\nol.progtrckr li.progtrckr-done:before {\n  content: \"\\2713\";\n  color: white;\n  background-color: #33C3F0;\n  width: 1.2em;\n  line-height: 1.2em;\n  border-radius: 1.2em;\n}\nol.progtrckr li.progtrckr-done:hover:before {\n  color: #0FA0CE;\n}\n", ""]);

/***/ },
/* 90 */
52,
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(92);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(38)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/jspears/WebstormProjects/subschema/node_modules/css-loader/index.js!/Users/jspears/WebstormProjects/subschema/node_modules/less-loader/index.js!/Users/jspears/WebstormProjects/subschema/src/styles/autocomplete.less", function() {
			var newContent = require("!!/Users/jspears/WebstormProjects/subschema/node_modules/css-loader/index.js!/Users/jspears/WebstormProjects/subschema/node_modules/less-loader/index.js!/Users/jspears/WebstormProjects/subschema/src/styles/autocomplete.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(76)();
	exports.push([module.id, ".autocomplete {\n  position: relative;\n}\n.autocomplete.found .form-control {\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.autocomplete.found .list-group {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1000;\n  width: 100%;\n}\n.autocomplete.found .list-group-item:first-child {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n  border-top: none;\n}\n.autocomplete.found .list-group-item {\n  cursor: pointer;\n}\n.autocomplete.found .list-group-item:hover {\n  background-color: #eee;\n}\n.autocomplete.found .focused {\n  background-color: #ddd;\n}\n", ""]);

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var api = {
	    inputClassName: 'form-control',
	    listClassName: 'edit-list list-group',
	    clz: function clz() {
	        var str = [];
	        for (var i = 0, l = arguments.length; i < l; i++) {
	            if (arguments[i] != null) {
	                str.push(arguments[i]);
	            }
	        }
	        return str.join(' ');
	    }
	};
	
	module.exports = api;

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = {
	  CLASSES: {
	    alert: "alert",
	    button: "btn",
	    "button-group": "btn-group",
	    "button-toolbar": "btn-toolbar",
	    column: "col",
	    "input-group": "input-group",
	    form: "form",
	    glyphicon: "glyphicon",
	    label: "label",
	    "list-group-item": "list-group-item",
	    panel: "panel",
	    "panel-group": "panel-group",
	    "progress-bar": "progress-bar",
	    nav: "nav",
	    navbar: "navbar",
	    modal: "modal",
	    row: "row",
	    well: "well"
	  },
	  STYLES: {
	    "default": "default",
	    primary: "primary",
	    success: "success",
	    info: "info",
	    warning: "warning",
	    danger: "danger",
	    link: "link",
	    inline: "inline",
	    tabs: "tabs",
	    pills: "pills"
	  },
	  SIZES: {
	    large: "lg",
	    medium: "md",
	    small: "sm",
	    xsmall: "xs"
	  },
	  GLYPHS: ["asterisk", "plus", "euro", "eur", "minus", "cloud", "envelope", "pencil", "glass", "music", "search", "heart", "star", "star-empty", "user", "film", "th-large", "th", "th-list", "ok", "remove", "zoom-in", "zoom-out", "off", "signal", "cog", "trash", "home", "file", "time", "road", "download-alt", "download", "upload", "inbox", "play-circle", "repeat", "refresh", "list-alt", "lock", "flag", "headphones", "volume-off", "volume-down", "volume-up", "qrcode", "barcode", "tag", "tags", "book", "bookmark", "print", "camera", "font", "bold", "italic", "text-height", "text-width", "align-left", "align-center", "align-right", "align-justify", "list", "indent-left", "indent-right", "facetime-video", "picture", "map-marker", "adjust", "tint", "edit", "share", "check", "move", "step-backward", "fast-backward", "backward", "play", "pause", "stop", "forward", "fast-forward", "step-forward", "eject", "chevron-left", "chevron-right", "plus-sign", "minus-sign", "remove-sign", "ok-sign", "question-sign", "info-sign", "screenshot", "remove-circle", "ok-circle", "ban-circle", "arrow-left", "arrow-right", "arrow-up", "arrow-down", "share-alt", "resize-full", "resize-small", "exclamation-sign", "gift", "leaf", "fire", "eye-open", "eye-close", "warning-sign", "plane", "calendar", "random", "comment", "magnet", "chevron-up", "chevron-down", "retweet", "shopping-cart", "folder-close", "folder-open", "resize-vertical", "resize-horizontal", "hdd", "bullhorn", "bell", "certificate", "thumbs-up", "thumbs-down", "hand-right", "hand-left", "hand-up", "hand-down", "circle-arrow-right", "circle-arrow-left", "circle-arrow-up", "circle-arrow-down", "globe", "wrench", "tasks", "filter", "briefcase", "fullscreen", "dashboard", "paperclip", "heart-empty", "link", "phone", "pushpin", "usd", "gbp", "sort", "sort-by-alphabet", "sort-by-alphabet-alt", "sort-by-order", "sort-by-order-alt", "sort-by-attributes", "sort-by-attributes-alt", "unchecked", "expand", "collapse-down", "collapse-up", "log-in", "flash", "log-out", "new-window", "record", "save", "open", "saved", "import", "export", "send", "floppy-disk", "floppy-saved", "floppy-remove", "floppy-save", "floppy-open", "credit-card", "transfer", "cutlery", "header", "compressed", "earphone", "phone-alt", "tower", "stats", "sd-video", "hd-video", "subtitles", "sound-stereo", "sound-dolby", "sound-5-1", "sound-6-1", "sound-7-1", "copyright-mark", "registration-mark", "cloud-download", "cloud-upload", "tree-conifer", "tree-deciduous", "cd", "save-file", "open-file", "level-up", "copy", "paste", "alert", "equalizer", "king", "queen", "pawn", "bishop", "knight", "baby-formula", "tent", "blackboard", "bed", "apple", "erase", "hourglass", "lamp", "duplicate", "piggy-bank", "scissors", "bitcoin", "yen", "ruble", "scale", "ice-lolly", "ice-lolly-tasted", "education", "option-horizontal", "option-vertical", "menu-hamburger", "modal-window", "oil", "grain", "sunglasses", "text-size", "text-color", "text-background", "object-align-top", "object-align-bottom", "object-align-horizontal", "object-align-left", "object-align-vertical", "object-align-right", "triangle-right", "triangle-left", "triangle-bottom", "triangle-top", "console", "superscript", "subscript", "menu-left", "menu-right", "menu-down", "menu-up"]
	};

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var ANONYMOUS = "<<anonymous>>";
	
	var CustomPropTypes = {
	  /**
	   * Checks whether a prop provides a DOM element
	   *
	   * The element can be provided in two forms:
	   * - Directly passed
	   * - Or passed an object which has a `getDOMNode` method which will return the required DOM element
	   *
	   * @param props
	   * @param propName
	   * @param componentName
	   * @returns {Error|undefined}
	   */
	  mountable: createMountableChecker()
	};
	
	/**
	 * Create chain-able isRequired validator
	 *
	 * Largely copied directly from:
	 *  https://github.com/facebook/react/blob/0.11-stable/src/core/ReactPropTypes.js#L94
	 */
	function createChainableTypeChecker(validate) {
	  function checkType(isRequired, props, propName, componentName) {
	    componentName = componentName || ANONYMOUS;
	    if (props[propName] == null) {
	      if (isRequired) {
	        return new Error("Required prop `" + propName + "` was not specified in " + "`" + componentName + "`.");
	      }
	    } else {
	      return validate(props, propName, componentName);
	    }
	  }
	
	  var chainedCheckType = checkType.bind(null, false);
	  chainedCheckType.isRequired = checkType.bind(null, true);
	
	  return chainedCheckType;
	}
	
	function createMountableChecker() {
	  function validate(props, propName, componentName) {
	    if (typeof props[propName] !== "object" || typeof props[propName].render !== "function" && props[propName].nodeType !== 1) {
	      return new Error("Invalid prop `" + propName + "` supplied to " + "`" + componentName + "`, expected a DOM element or an object that has a `render` method");
	    }
	  }
	
	  return createChainableTypeChecker(validate);
	}
	
	module.exports = CustomPropTypes;

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used by `_.template` to customize its `_.assign` use.
	 *
	 * **Note:** This function is like `assignDefaults` except that it ignores
	 * inherited property values when checking if a property is `undefined`.
	 *
	 * @private
	 * @param {*} objectValue The destination object property value.
	 * @param {*} sourceValue The source object property value.
	 * @param {string} key The key associated with the object and source values.
	 * @param {Object} object The destination object.
	 * @returns {*} Returns the value to assign to the destination object.
	 */
	function assignOwnDefaults(objectValue, sourceValue, key, object) {
	  return (objectValue === undefined || !hasOwnProperty.call(object, key))
	    ? sourceValue
	    : objectValue;
	}
	
	module.exports = assignOwnDefaults;


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var getSymbols = __webpack_require__(115),
	    keys = __webpack_require__(105);
	
	/** Used for native method references. */
	var arrayProto = Array.prototype;
	
	/** Native method references. */
	var push = arrayProto.push;
	
	/**
	 * A specialized version of `_.assign` for customizing assigned values without
	 * support for argument juggling, multiple sources, and `this` binding `customizer`
	 * functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {Function} customizer The function to customize assigned values.
	 * @returns {Object} Returns `object`.
	 */
	function assignWith(object, source, customizer) {
	  var props = keys(source);
	  push.apply(props, getSymbols(source));
	
	  var index = -1,
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index],
	        value = object[key],
	        result = customizer(value, source[key], key, object, source);
	
	    if ((result === result ? (result !== value) : (value === value)) ||
	        (value === undefined && !(key in object))) {
	      object[key] = result;
	    }
	  }
	  return object;
	}
	
	module.exports = assignWith;


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	var isError = __webpack_require__(103),
	    restParam = __webpack_require__(117);
	
	/**
	 * Attempts to invoke `func`, returning either the result or the caught error
	 * object. Any additional arguments are provided to `func` when it is invoked.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {Function} func The function to attempt.
	 * @returns {*} Returns the `func` result or error object.
	 * @example
	 *
	 * // avoid throwing errors for invalid selectors
	 * var elements = _.attempt(function(selector) {
	 *   return document.querySelectorAll(selector);
	 * }, '>_>');
	 *
	 * if (_.isError(elements)) {
	 *   elements = [];
	 * }
	 */
	var attempt = restParam(function(func, args) {
	  try {
	    return func.apply(undefined, args);
	  } catch(e) {
	    return isError(e) ? e : new Error(e);
	  }
	});
	
	module.exports = attempt;


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	var baseCopy = __webpack_require__(116),
	    getSymbols = __webpack_require__(115),
	    isNative = __webpack_require__(110),
	    keys = __webpack_require__(105);
	
	/** Native method references. */
	var preventExtensions = isNative(Object.preventExtensions = Object.preventExtensions) && preventExtensions;
	
	/** Used as `baseAssign`. */
	var nativeAssign = (function() {
	  // Avoid `Object.assign` in Firefox 34-37 which have an early implementation
	  // with a now defunct try/catch behavior. See https://bugzilla.mozilla.org/show_bug.cgi?id=1103344
	  // for more details.
	  //
	  // Use `Object.preventExtensions` on a plain object instead of simply using
	  // `Object('x')` because Chrome and IE fail to throw an error when attempting
	  // to assign values to readonly indexes of strings in strict mode.
	  var object = { '1': 0 },
	      func = preventExtensions && isNative(func = Object.assign) && func;
	
	  try { func(preventExtensions(object), 'xo'); } catch(e) {}
	  return !object[1] && func;
	}());
	
	/**
	 * The base implementation of `_.assign` without support for argument juggling,
	 * multiple sources, and `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	var baseAssign = nativeAssign || function(object, source) {
	  return source == null
	    ? object
	    : baseCopy(source, getSymbols(source), baseCopy(source, keys(source), object));
	};
	
	module.exports = baseAssign;


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Converts `value` to a string if it is not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  if (typeof value == 'string') {
	    return value;
	  }
	  return value == null ? '' : (value + '');
	}
	
	module.exports = baseToString;


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.values` and `_.valuesIn` which creates an
	 * array of `object` property values corresponding to the property names
	 * of `props`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} props The property names to get values for.
	 * @returns {Object} Returns the array of property values.
	 */
	function baseValues(object, props) {
	  var index = -1,
	      length = props.length,
	      result = Array(length);
	
	  while (++index < length) {
	    result[index] = object[props[index]];
	  }
	  return result;
	}
	
	module.exports = baseValues;


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	/** Used to escape characters for inclusion in compiled string literals. */
	var stringEscapes = {
	  '\\': '\\',
	  "'": "'",
	  '\n': 'n',
	  '\r': 'r',
	  '\u2028': 'u2028',
	  '\u2029': 'u2029'
	};
	
	/**
	 * Used by `_.template` to escape characters for inclusion in compiled
	 * string literals.
	 *
	 * @private
	 * @param {string} chr The matched character to escape.
	 * @returns {string} Returns the escaped character.
	 */
	function escapeStringChar(chr) {
	  return '\\' + stringEscapes[chr];
	}
	
	module.exports = escapeStringChar;


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(111);
	
	/** `Object#toString` result references. */
	var errorTag = '[object Error]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
	 * `SyntaxError`, `TypeError`, or `URIError` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
	 * @example
	 *
	 * _.isError(new Error);
	 * // => true
	 *
	 * _.isError(Error);
	 * // => false
	 */
	function isError(value) {
	  return isObjectLike(value) && typeof value.message == 'string' && objToString.call(value) == errorTag;
	}
	
	module.exports = isError;


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(118),
	    isIndex = __webpack_require__(119),
	    isLength = __webpack_require__(112),
	    isObject = __webpack_require__(120);
	
	/**
	 * Checks if the provided arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number') {
	    var length = getLength(object),
	        prereq = isLength(length) && isIndex(index, length);
	  } else {
	    prereq = type == 'string' && index in object;
	  }
	  if (prereq) {
	    var other = object[index];
	    return value === value ? (value === other) : (other !== other);
	  }
	  return false;
	}
	
	module.exports = isIterateeCall;


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(112),
	    isNative = __webpack_require__(110),
	    isObject = __webpack_require__(120),
	    shimKeys = __webpack_require__(121);
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;
	
	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
	  if (object) {
	    var Ctor = object.constructor,
	        length = object.length;
	  }
	  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	      (typeof object != 'function' && isLength(length))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};
	
	module.exports = keys;


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	/** Used to match template delimiters. */
	var reInterpolate = /<%=([\s\S]+?)%>/g;
	
	module.exports = reInterpolate;


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	var escape = __webpack_require__(122),
	    reEscape = __webpack_require__(123),
	    reEvaluate = __webpack_require__(124),
	    reInterpolate = __webpack_require__(106);
	
	/**
	 * By default, the template delimiters used by lodash are like those in
	 * embedded Ruby (ERB). Change the following template settings to use
	 * alternative delimiters.
	 *
	 * @static
	 * @memberOf _
	 * @type Object
	 */
	var templateSettings = {
	
	  /**
	   * Used to detect `data` property values to be HTML-escaped.
	   *
	   * @memberOf _.templateSettings
	   * @type RegExp
	   */
	  'escape': reEscape,
	
	  /**
	   * Used to detect code to be evaluated.
	   *
	   * @memberOf _.templateSettings
	   * @type RegExp
	   */
	  'evaluate': reEvaluate,
	
	  /**
	   * Used to detect `data` property values to inject.
	   *
	   * @memberOf _.templateSettings
	   * @type RegExp
	   */
	  'interpolate': reInterpolate,
	
	  /**
	   * Used to reference the data object in the template text.
	   *
	   * @memberOf _.templateSettings
	   * @type string
	   */
	  'variable': '',
	
	  /**
	   * Used to import variables into the compiled template.
	   *
	   * @memberOf _.templateSettings
	   * @type Object
	   */
	  'imports': {
	
	    /**
	     * A reference to the `lodash` function.
	     *
	     * @memberOf _.templateSettings.imports
	     * @type Function
	     */
	    '_': { 'escape': escape }
	  }
	};
	
	module.exports = templateSettings;


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	var assignWith = __webpack_require__(97),
	    baseAssign = __webpack_require__(99),
	    createAssigner = __webpack_require__(125);
	
	/**
	 * Assigns own enumerable properties of source object(s) to the destination
	 * object. Subsequent sources overwrite property assignments of previous sources.
	 * If `customizer` is provided it is invoked to produce the assigned values.
	 * The `customizer` is bound to `thisArg` and invoked with five arguments:
	 * (objectValue, sourceValue, key, object, source).
	 *
	 * **Note:** This method mutates `object` and is based on
	 * [`Object.assign`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign).
	 *
	 *
	 * @static
	 * @memberOf _
	 * @alias extend
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {*} [thisArg] The `this` binding of `customizer`.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
	 * // => { 'user': 'fred', 'age': 40 }
	 *
	 * // using a customizer callback
	 * var defaults = _.partialRight(_.assign, function(value, other) {
	 *   return _.isUndefined(value) ? other : value;
	 * });
	 *
	 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	 * // => { 'user': 'barney', 'age': 36 }
	 */
	var assign = createAssigner(function(object, source, customizer) {
	  return customizer
	    ? assignWith(object, source, customizer)
	    : baseAssign(object, source);
	});
	
	module.exports = assign;


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.isFunction` without support for environments
	 * with incorrect `typeof` results.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 */
	function baseIsFunction(value) {
	  // Avoid a Chakra JIT bug in compatibility modes of IE 11.
	  // See https://github.com/jashkenas/underscore/issues/1621 for more details.
	  return typeof value == 'function' || false;
	}
	
	module.exports = baseIsFunction;


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	var escapeRegExp = __webpack_require__(126),
	    isObjectLike = __webpack_require__(111);
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]';
	
	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  escapeRegExp(objToString)
	  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (objToString.call(value) == funcTag) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}
	
	module.exports = isNative;


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	module.exports = isLength;


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	var baseForOwn = __webpack_require__(127),
	    createBaseEach = __webpack_require__(128);
	
	/**
	 * The base implementation of `_.forEach` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object|string} Returns `collection`.
	 */
	var baseEach = createBaseEach(baseForOwn);
	
	module.exports = baseEach;


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	var baseCallback = __webpack_require__(129),
	    baseFind = __webpack_require__(130),
	    baseFindIndex = __webpack_require__(131),
	    isArray = __webpack_require__(84);
	
	/**
	 * Creates a `_.find` or `_.findLast` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new find function.
	 */
	function createFind(eachFunc, fromRight) {
	  return function(collection, predicate, thisArg) {
	    predicate = baseCallback(predicate, thisArg, 3);
	    if (isArray(collection)) {
	      var index = baseFindIndex(collection, predicate, fromRight);
	      return index > -1 ? collection[index] : undefined;
	    }
	    return baseFind(collection, predicate, eachFunc);
	  }
	}
	
	module.exports = createFind;


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	var constant = __webpack_require__(132),
	    isNative = __webpack_require__(110),
	    toObject = __webpack_require__(133);
	
	/** Native method references. */
	var getOwnPropertySymbols = isNative(getOwnPropertySymbols = Object.getOwnPropertySymbols) && getOwnPropertySymbols;
	
	/**
	 * Creates an array of the own symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols = !getOwnPropertySymbols ? constant([]) : function(object) {
	  return getOwnPropertySymbols(toObject(object));
	};
	
	module.exports = getSymbols;


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property names to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @returns {Object} Returns `object`.
	 */
	function baseCopy(source, props, object) {
	  object || (object = {});
	
	  var index = -1,
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index];
	    object[key] = source[key];
	  }
	  return object;
	}
	
	module.exports = baseCopy;


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;
	
	/**
	 * Creates a function that invokes `func` with the `this` binding of the
	 * created function and arguments from `start` and beyond provided as an array.
	 *
	 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var say = _.restParam(function(what, names) {
	 *   return what + ' ' + _.initial(names).join(', ') +
	 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	 * });
	 *
	 * say('hello', 'fred', 'barney', 'pebbles');
	 * // => 'hello fred, barney, & pebbles'
	 */
	function restParam(func, start) {
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        rest = Array(length);
	
	    while (++index < length) {
	      rest[index] = args[start + index];
	    }
	    switch (start) {
	      case 0: return func.call(this, rest);
	      case 1: return func.call(this, args[0], rest);
	      case 2: return func.call(this, args[0], args[1], rest);
	    }
	    var otherArgs = Array(start + 1);
	    index = -1;
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = rest;
	    return func.apply(this, otherArgs);
	  };
	}
	
	module.exports = restParam;


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(134);
	
	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * in Safari on iOS 8.1 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');
	
	module.exports = getLength;


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = +value;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}
	
	module.exports = isIndex;


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return type == 'function' || (!!value && type == 'object');
	}
	
	module.exports = isObject;


/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(135),
	    isArray = __webpack_require__(84),
	    isIndex = __webpack_require__(119),
	    isLength = __webpack_require__(112),
	    keysIn = __webpack_require__(136),
	    support = __webpack_require__(137);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;
	
	  var allowIndexes = length && isLength(length) &&
	    (isArray(object) || (support.nonEnumArgs && isArguments(object)));
	
	  var index = -1,
	      result = [];
	
	  while (++index < propsLength) {
	    var key = props[index];
	    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = shimKeys;


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(100),
	    escapeHtmlChar = __webpack_require__(138);
	
	/** Used to match HTML entities and HTML characters. */
	var reUnescapedHtml = /[&<>"'`]/g,
	    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
	
	/**
	 * Converts the characters "&", "<", ">", '"', "'", and "\`", in `string` to
	 * their corresponding HTML entities.
	 *
	 * **Note:** No other characters are escaped. To escape additional characters
	 * use a third-party library like [_he_](https://mths.be/he).
	 *
	 * Though the ">" character is escaped for symmetry, characters like
	 * ">" and "/" don't require escaping in HTML and have no special meaning
	 * unless they're part of a tag or unquoted attribute value.
	 * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
	 * (under "semi-related fun fact") for more details.
	 *
	 * Backticks are escaped because in Internet Explorer < 9, they can break out
	 * of attribute values or HTML comments. See [#59](https://html5sec.org/#59),
	 * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
	 * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
	 * for more details.
	 *
	 * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
	 * to reduce XSS vectors.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escape('fred, barney, & pebbles');
	 * // => 'fred, barney, &amp; pebbles'
	 */
	function escape(string) {
	  // Reset `lastIndex` because in IE < 9 `String#replace` does not.
	  string = baseToString(string);
	  return (string && reHasUnescapedHtml.test(string))
	    ? string.replace(reUnescapedHtml, escapeHtmlChar)
	    : string;
	}
	
	module.exports = escape;


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	/** Used to match template delimiters. */
	var reEscape = /<%-([\s\S]+?)%>/g;
	
	module.exports = reEscape;


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	/** Used to match template delimiters. */
	var reEvaluate = /<%([\s\S]+?)%>/g;
	
	module.exports = reEvaluate;


/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	var bindCallback = __webpack_require__(139),
	    isIterateeCall = __webpack_require__(104),
	    restParam = __webpack_require__(117);
	
	/**
	 * Creates a function that assigns properties of source object(s) to a given
	 * destination object.
	 *
	 * **Note:** This function is used to create `_.assign`, `_.defaults`, and `_.merge`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return restParam(function(object, sources) {
	    var index = -1,
	        length = object == null ? 0 : sources.length,
	        customizer = length > 2 && sources[length - 2],
	        guard = length > 2 && sources[2],
	        thisArg = length > 1 && sources[length - 1];
	
	    if (typeof customizer == 'function') {
	      customizer = bindCallback(customizer, thisArg, 5);
	      length -= 2;
	    } else {
	      customizer = typeof thisArg == 'function' ? thisArg : null;
	      length -= (customizer ? 1 : 0);
	    }
	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? null : customizer;
	      length = 1;
	    }
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, customizer);
	      }
	    }
	    return object;
	  });
	}
	
	module.exports = createAssigner;


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(100);
	
	/**
	 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
	 * In addition to special characters the forward slash is escaped to allow for
	 * easier `eval` use and `Function` compilation.
	 */
	var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
	    reHasRegExpChars = RegExp(reRegExpChars.source);
	
	/**
	 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
	 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escapeRegExp('[lodash](https://lodash.com/)');
	 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
	 */
	function escapeRegExp(string) {
	  string = baseToString(string);
	  return (string && reHasRegExpChars.test(string))
	    ? string.replace(reRegExpChars, '\\$&')
	    : string;
	}
	
	module.exports = escapeRegExp;


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(140),
	    keys = __webpack_require__(105);
	
	/**
	 * The base implementation of `_.forOwn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return baseFor(object, iteratee, keys);
	}
	
	module.exports = baseForOwn;


/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(118),
	    isLength = __webpack_require__(112),
	    toObject = __webpack_require__(133);
	
	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    var length = collection ? getLength(collection) : 0;
	    if (!isLength(length)) {
	      return eachFunc(collection, iteratee);
	    }
	    var index = fromRight ? length : -1,
	        iterable = toObject(collection);
	
	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}
	
	module.exports = createBaseEach;


/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	var baseMatches = __webpack_require__(141),
	    baseMatchesProperty = __webpack_require__(142),
	    bindCallback = __webpack_require__(139),
	    identity = __webpack_require__(143),
	    property = __webpack_require__(144);
	
	/**
	 * The base implementation of `_.callback` which supports specifying the
	 * number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {*} [func=_.identity] The value to convert to a callback.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function baseCallback(func, thisArg, argCount) {
	  var type = typeof func;
	  if (type == 'function') {
	    return thisArg === undefined
	      ? func
	      : bindCallback(func, thisArg, argCount);
	  }
	  if (func == null) {
	    return identity;
	  }
	  if (type == 'object') {
	    return baseMatches(func);
	  }
	  return thisArg === undefined
	    ? property(func)
	    : baseMatchesProperty(func, thisArg);
	}
	
	module.exports = baseCallback;


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
	 * without support for callback shorthands and `this` binding, which iterates
	 * over `collection` using the provided `eachFunc`.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to search.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {Function} eachFunc The function to iterate over `collection`.
	 * @param {boolean} [retKey] Specify returning the key of the found element
	 *  instead of the element itself.
	 * @returns {*} Returns the found element or its key, else `undefined`.
	 */
	function baseFind(collection, predicate, eachFunc, retKey) {
	  var result;
	  eachFunc(collection, function(value, key, collection) {
	    if (predicate(value, key, collection)) {
	      result = retKey ? key : value;
	      return false;
	    }
	  });
	  return result;
	}
	
	module.exports = baseFind;


/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for callback shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromRight) {
	  var length = array.length,
	      index = fromRight ? length : -1;
	
	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}
	
	module.exports = baseFindIndex;


/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 * var getter = _.constant(object);
	 *
	 * getter() === object;
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}
	
	module.exports = constant;


/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(120);
	
	/**
	 * Converts `value` to an object if it is not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Object} Returns the object.
	 */
	function toObject(value) {
	  return isObject(value) ? value : Object(value);
	}
	
	module.exports = toObject;


/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}
	
	module.exports = baseProperty;


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(112),
	    isObjectLike = __webpack_require__(111);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  var length = isObjectLike(value) ? value.length : undefined;
	  return isLength(length) && objToString.call(value) == argsTag;
	}
	
	module.exports = isArguments;


/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(135),
	    isArray = __webpack_require__(84),
	    isIndex = __webpack_require__(119),
	    isLength = __webpack_require__(112),
	    isObject = __webpack_require__(120),
	    support = __webpack_require__(137);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;
	
	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;
	
	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = keysIn;


/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to detect DOM support. */
	var document = (document = global.window) && document.document;
	
	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/**
	 * An object environment feature flags.
	 *
	 * @static
	 * @memberOf _
	 * @type Object
	 */
	var support = {};
	
	(function(x) {
	  var Ctor = function() { this.x = x; },
	      object = { '0': x, 'length': x },
	      props = [];
	
	  Ctor.prototype = { 'valueOf': x, 'y': x };
	  for (var key in new Ctor) { props.push(key); }
	
	  /**
	   * Detect if functions can be decompiled by `Function#toString`
	   * (all but Firefox OS certified apps, older Opera mobile browsers, and
	   * the PlayStation 3; forced `false` for Windows 8 apps).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.funcDecomp = /\bthis\b/.test(function() { return this; });
	
	  /**
	   * Detect if `Function#name` is supported (all but IE).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.funcNames = typeof Function.name == 'string';
	
	  /**
	   * Detect if the DOM is supported.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  try {
	    support.dom = document.createDocumentFragment().nodeType === 11;
	  } catch(e) {
	    support.dom = false;
	  }
	
	  /**
	   * Detect if `arguments` object indexes are non-enumerable.
	   *
	   * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
	   * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
	   * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
	   * checks for indexes that exceed the number of function parameters and
	   * whose associated argument values are `0`.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  try {
	    support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
	  } catch(e) {
	    support.nonEnumArgs = true;
	  }
	}(1, 0));
	
	module.exports = support;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	/** Used to map characters to HTML entities. */
	var htmlEscapes = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#39;',
	  '`': '&#96;'
	};
	
	/**
	 * Used by `_.escape` to convert characters to HTML entities.
	 *
	 * @private
	 * @param {string} chr The matched character to escape.
	 * @returns {string} Returns the escaped character.
	 */
	function escapeHtmlChar(chr) {
	  return htmlEscapes[chr];
	}
	
	module.exports = escapeHtmlChar;


/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(143);
	
	/**
	 * A specialized version of `baseCallback` which only supports `this` binding
	 * and specifying the number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function bindCallback(func, thisArg, argCount) {
	  if (typeof func != 'function') {
	    return identity;
	  }
	  if (thisArg === undefined) {
	    return func;
	  }
	  switch (argCount) {
	    case 1: return function(value) {
	      return func.call(thisArg, value);
	    };
	    case 3: return function(value, index, collection) {
	      return func.call(thisArg, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(thisArg, accumulator, value, index, collection);
	    };
	    case 5: return function(value, other, key, object, source) {
	      return func.call(thisArg, value, other, key, object, source);
	    };
	  }
	  return function() {
	    return func.apply(thisArg, arguments);
	  };
	}
	
	module.exports = bindCallback;


/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(145);
	
	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iteratee functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();
	
	module.exports = baseFor;


/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsMatch = __webpack_require__(146),
	    constant = __webpack_require__(132),
	    isStrictComparable = __webpack_require__(147),
	    keys = __webpack_require__(105),
	    toObject = __webpack_require__(133);
	
	/**
	 * The base implementation of `_.matches` which does not clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatches(source) {
	  var props = keys(source),
	      length = props.length;
	
	  if (!length) {
	    return constant(true);
	  }
	  if (length == 1) {
	    var key = props[0],
	        value = source[key];
	
	    if (isStrictComparable(value)) {
	      return function(object) {
	        if (object == null) {
	          return false;
	        }
	        return object[key] === value && (value !== undefined || (key in toObject(object)));
	      };
	    }
	  }
	  var values = Array(length),
	      strictCompareFlags = Array(length);
	
	  while (length--) {
	    value = source[props[length]];
	    values[length] = value;
	    strictCompareFlags[length] = isStrictComparable(value);
	  }
	  return function(object) {
	    return object != null && baseIsMatch(toObject(object), props, values, strictCompareFlags);
	  };
	}
	
	module.exports = baseMatches;


/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(148),
	    baseIsEqual = __webpack_require__(149),
	    baseSlice = __webpack_require__(150),
	    isArray = __webpack_require__(84),
	    isKey = __webpack_require__(151),
	    isStrictComparable = __webpack_require__(147),
	    last = __webpack_require__(152),
	    toObject = __webpack_require__(133),
	    toPath = __webpack_require__(153);
	
	/**
	 * The base implementation of `_.matchesProperty` which does not which does
	 * not clone `value`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} value The value to compare.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatchesProperty(path, value) {
	  var isArr = isArray(path),
	      isCommon = isKey(path) && isStrictComparable(value),
	      pathKey = (path + '');
	
	  path = toPath(path);
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    var key = pathKey;
	    object = toObject(object);
	    if ((isArr || !isCommon) && !(key in object)) {
	      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
	      if (object == null) {
	        return false;
	      }
	      key = last(path);
	      object = toObject(object);
	    }
	    return object[key] === value
	      ? (value !== undefined || (key in object))
	      : baseIsEqual(value, object[key], null, true);
	  };
	}
	
	module.exports = baseMatchesProperty;


/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}
	
	module.exports = identity;


/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(134),
	    basePropertyDeep = __webpack_require__(154),
	    isKey = __webpack_require__(151);
	
	/**
	 * Creates a function which returns the property value at `path` on a
	 * given object.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': { 'c': 2 } } },
	 *   { 'a': { 'b': { 'c': 1 } } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b.c'));
	 * // => [2, 1]
	 *
	 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
	 * // => [1, 2]
	 */
	function property(path) {
	  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
	}
	
	module.exports = property;


/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(133);
	
	/**
	 * Creates a base function for `_.forIn` or `_.forInRight`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var iterable = toObject(object),
	        props = keysFunc(object),
	        length = props.length,
	        index = fromRight ? length : -1;
	
	    while ((fromRight ? index-- : ++index < length)) {
	      var key = props[index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}
	
	module.exports = createBaseFor;


/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqual = __webpack_require__(149);
	
	/**
	 * The base implementation of `_.isMatch` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Array} props The source property names to match.
	 * @param {Array} values The source values to match.
	 * @param {Array} strictCompareFlags Strict comparison flags for source values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
	  var index = -1,
	      length = props.length,
	      noCustomizer = !customizer;
	
	  while (++index < length) {
	    if ((noCustomizer && strictCompareFlags[index])
	          ? values[index] !== object[props[index]]
	          : !(props[index] in object)
	        ) {
	      return false;
	    }
	  }
	  index = -1;
	  while (++index < length) {
	    var key = props[index],
	        objValue = object[key],
	        srcValue = values[index];
	
	    if (noCustomizer && strictCompareFlags[index]) {
	      var result = objValue !== undefined || (key in object);
	    } else {
	      result = customizer ? customizer(objValue, srcValue, key) : undefined;
	      if (result === undefined) {
	        result = baseIsEqual(srcValue, objValue, customizer, true);
	      }
	    }
	    if (!result) {
	      return false;
	    }
	  }
	  return true;
	}
	
	module.exports = baseIsMatch;


/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(120);
	
	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
	}
	
	module.exports = isStrictComparable;


/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(133);
	
	/**
	 * The base implementation of `get` without support for string paths
	 * and default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} path The path of the property to get.
	 * @param {string} [pathKey] The key representation of path.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path, pathKey) {
	  if (object == null) {
	    return;
	  }
	  if (pathKey !== undefined && pathKey in toObject(object)) {
	    path = [pathKey];
	  }
	  var index = -1,
	      length = path.length;
	
	  while (object != null && ++index < length) {
	    var result = object = object[path[index]];
	  }
	  return result;
	}
	
	module.exports = baseGet;


/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqualDeep = __webpack_require__(155);
	
	/**
	 * The base implementation of `_.isEqual` without support for `this` binding
	 * `customizer` functions.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
	  // Exit early for identical values.
	  if (value === other) {
	    // Treat `+0` vs. `-0` as not equal.
	    return value !== 0 || (1 / value == 1 / other);
	  }
	  var valType = typeof value,
	      othType = typeof other;
	
	  // Exit early for unlike primitive values.
	  if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
	      value == null || other == null) {
	    // Return `false` unless both values are `NaN`.
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
	}
	
	module.exports = baseIsEqual;


/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */
	function baseSlice(array, start, end) {
	  var index = -1,
	      length = array.length;
	
	  start = start == null ? 0 : (+start || 0);
	  if (start < 0) {
	    start = -start > length ? 0 : (length + start);
	  }
	  end = (end === undefined || end > length) ? length : (+end || 0);
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : ((end - start) >>> 0);
	  start >>>= 0;
	
	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}
	
	module.exports = baseSlice;


/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(84),
	    toObject = __webpack_require__(133);
	
	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]+|(["'])(?:(?!\1)[^\n\\]|\\.)*?)\1\]/,
	    reIsPlainProp = /^\w*$/;
	
	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  var type = typeof value;
	  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
	    return true;
	  }
	  if (isArray(value)) {
	    return false;
	  }
	  var result = !reIsDeepProp.test(value);
	  return result || (object != null && value in toObject(object));
	}
	
	module.exports = isKey;


/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Gets the last element of `array`.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to query.
	 * @returns {*} Returns the last element of `array`.
	 * @example
	 *
	 * _.last([1, 2, 3]);
	 * // => 3
	 */
	function last(array) {
	  var length = array ? array.length : 0;
	  return length ? array[length - 1] : undefined;
	}
	
	module.exports = last;


/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(100),
	    isArray = __webpack_require__(84);
	
	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
	
	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;
	
	/**
	 * Converts `value` to property path array if it is not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Array} Returns the property path array.
	 */
	function toPath(value) {
	  if (isArray(value)) {
	    return value;
	  }
	  var result = [];
	  baseToString(value).replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	}
	
	module.exports = toPath;


/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(148),
	    toPath = __webpack_require__(153);
	
	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function basePropertyDeep(path) {
	  var pathKey = (path + '');
	  path = toPath(path);
	  return function(object) {
	    return baseGet(object, path, pathKey);
	  };
	}
	
	module.exports = basePropertyDeep;


/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	var equalArrays = __webpack_require__(156),
	    equalByTag = __webpack_require__(157),
	    equalObjects = __webpack_require__(158),
	    isArray = __webpack_require__(84),
	    isTypedArray = __webpack_require__(159);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag = '[object Object]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
	 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;
	
	  if (!objIsArr) {
	    objTag = objToString.call(object);
	    if (objTag == argsTag) {
	      objTag = objectTag;
	    } else if (objTag != objectTag) {
	      objIsArr = isTypedArray(object);
	    }
	  }
	  if (!othIsArr) {
	    othTag = objToString.call(other);
	    if (othTag == argsTag) {
	      othTag = objectTag;
	    } else if (othTag != objectTag) {
	      othIsArr = isTypedArray(other);
	    }
	  }
	  var objIsObj = objTag == objectTag,
	      othIsObj = othTag == objectTag,
	      isSameTag = objTag == othTag;
	
	  if (isSameTag && !(objIsArr || objIsObj)) {
	    return equalByTag(object, other, objTag);
	  }
	  if (!isLoose) {
	    var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
	
	    if (valWrapped || othWrapped) {
	      return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  // For more information on detecting circular references see https://es5.github.io/#JO.
	  stackA || (stackA = []);
	  stackB || (stackB = []);
	
	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] == object) {
	      return stackB[length] == other;
	    }
	  }
	  // Add `object` and `other` to the stack of traversed objects.
	  stackA.push(object);
	  stackB.push(other);
	
	  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);
	
	  stackA.pop();
	  stackB.pop();
	
	  return result;
	}
	
	module.exports = baseIsEqualDeep;


/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing arrays.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var index = -1,
	      arrLength = array.length,
	      othLength = other.length,
	      result = true;
	
	  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
	    return false;
	  }
	  // Deep compare the contents, ignoring non-numeric properties.
	  while (result && ++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];
	
	    result = undefined;
	    if (customizer) {
	      result = isLoose
	        ? customizer(othValue, arrValue, index)
	        : customizer(arrValue, othValue, index);
	    }
	    if (result === undefined) {
	      // Recursively compare arrays (susceptible to call stack limits).
	      if (isLoose) {
	        var othIndex = othLength;
	        while (othIndex--) {
	          othValue = other[othIndex];
	          result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	          if (result) {
	            break;
	          }
	        }
	      } else {
	        result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	      }
	    }
	  }
	  return !!result;
	}
	
	module.exports = equalArrays;


/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    stringTag = '[object String]';
	
	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} value The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag) {
	  switch (tag) {
	    case boolTag:
	    case dateTag:
	      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	      return +object == +other;
	
	    case errorTag:
	      return object.name == other.name && object.message == other.message;
	
	    case numberTag:
	      // Treat `NaN` vs. `NaN` as equal.
	      return (object != +object)
	        ? other != +other
	        // But, treat `-0` vs. `+0` as not equal.
	        : (object == 0 ? ((1 / object) == (1 / other)) : object == +other);
	
	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings primitives and string
	      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	      return object == (other + '');
	  }
	  return false;
	}
	
	module.exports = equalByTag;


/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(105);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;
	
	  if (objLength != othLength && !isLoose) {
	    return false;
	  }
	  var skipCtor = isLoose,
	      index = -1;
	
	  while (++index < objLength) {
	    var key = objProps[index],
	        result = isLoose ? key in other : hasOwnProperty.call(other, key);
	
	    if (result) {
	      var objValue = object[key],
	          othValue = other[key];
	
	      result = undefined;
	      if (customizer) {
	        result = isLoose
	          ? customizer(othValue, objValue, key)
	          : customizer(objValue, othValue, key);
	      }
	      if (result === undefined) {
	        // Recursively compare objects (susceptible to call stack limits).
	        result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB);
	      }
	    }
	    if (!result) {
	      return false;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (!skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;
	
	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      return false;
	    }
	  }
	  return true;
	}
	
	module.exports = equalObjects;


/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(112),
	    isObjectLike = __webpack_require__(111);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';
	
	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';
	
	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	}
	
	module.exports = isTypedArray;


/***/ }
/******/ ])))});;
//# sourceMappingURL=example-app.0.5.0-debug.js.map