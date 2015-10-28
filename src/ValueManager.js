"use strict";

var tu = require('./tutils');

function removeListener(listeners) {
    return function ValueManager$removeListener(path, listener) {
        var remove = listeners.slice(0);
        if (path && !listener && !tu.isString(path)) {
            path = listener;
            listener = null;
        }
        if (path) {
            remove = remove.filter(v=> {
                return v.path === path;
            });
        }
        if (listener) {
            //make the return of addListener also able to be used
            //in remove listener.
            remove = remove.filter(v=> {
                return v === listener || v.listener === listener;
            });
        }
        return remove.map(function (r) {
            var idx = this.indexOf(r);
            if (idx > -1) {
                return this.splice(idx, 1)[0];
            }
        }, listeners);
    }
}
/**
 * This callback is displayed as a global member.
 * It will call them in order of most distant to least distance path.
 * In the event of two paths being the same distance, it will call the last
 * added first.
 *
 * @callback ValueManagerListener
 * @param {*} newValue - The new value to be updated
 * @param {*} oldValue - The previous value updated.
 * @param {String} path - The path to value updated
 */
function addListener(listeners, find, findOld) {
    function remove() {
        listeners.splice(listeners.indexOf(this), 1);
        return this;
    }

    function once() {
        var self = this, listener = self.listener;

        this.listener = function () {
            var ret = listener.apply(this, arguments);
            self.remove();
            return ret;
        }
        return this;
    }

    return function ValueManager$addListener(path, listener, scope, init) {
        if (tu.isFunction(path)) {
            init = scope;
            scope = listener;
            listener = path;
            path = null
        }
        if (listener == null) {
            return;
        }
        var obj = {path, listener, scope, remove, once};

        init = init === true ? obj.listener : tu.isFunction(init) ? init : null;
        if (init) {
            init.call(obj.scope, find(path), findOld(path), path)
        }
        if (listeners.length === 0) {
            listeners.push(obj)
        } else {
            var plength = path ? path.split('.').length : 0;
            for (var i = 0, l = listeners.length; i < l; i++) {

                var lp = listeners[i].path, cllength = lp ? lp.split('.').length : 0;

                if (plength >= cllength || i + 1 === l) {
                    listeners.splice(i, 0, obj);
                    break;
                }
            }
        }
        return obj;
    }
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
/**
 * Value manager listens and changes values on the objects.
 * It can be passed a property to any subschema type, or form.
 *
 * @param value
 * @param errors
 * @returns {ValueManager}
 * @constructor
 */
function ValueManager(value, errors) {
    if (!(this instanceof ValueManager)) {
        return new ValueManager(value, errors);
    }
    this.listeners = [];
    this.errorListeners = [];
    this.validateListeners = [];
    this.stateListeners = [];
    this.setValue(value || {});
    this.oldValue = tu.extend({}, this.value);
    this.setErrors(errors);


    var self = this;
    /**
     * Removes a value listener.
     * @param {String} [path] -  path to remove.
     * @param {ValueManagerListener} [fn] - the listener to look for.
     * @param {Listener} [listener] - the listener returned from addListener();
     */
    this.removeListener = removeListener(this.listeners);

    /**
     * Adds a value listener
     * @param {String} [path] - Path to listen to, null or no value will listen to all changes.
     * @param {ValueManagerListener} listener - The listener to execute.
     * @param {Object} [scope] - The scope to execute the listener in.
     * @param {boolean|Function}  init - true or a function will execute when the listener is added.
     * */
    this.addListener = addListener(this.listeners, function (prop) {
        return self.path(prop, self.value);
    }, function (prop) {
        return self.path(prop, self.oldValue);
    });
    /**
     * Removes a error listener.
     * @param {String} [path] -  path to remove.
     * @param {ValueManagerListener} [fn] - the listener to look for.
     * @param {Listener} [listener] - the listener returned from addListener();
     */
    this.removeErrorListener = removeListener(this.errorListeners);
    /**
     * Adds an error  listener
     * @param {String} [path] - Path to listen to, null or no value will listen to all changes.
     * @param {ValueManagerListener} listener - The listener to execute.
     * @param {Object} [scope] - The scope to execute the listener in.
     * @param {boolean|Function}  init - true or a function will execute when the listener is added.
     * */
    this.addErrorListener = addListener(this.errorListeners, function (prop) {
        return self.errorsFor(prop);
    }, tu.noop);

    /**
     * Adds a validate  listener
     * @param {String} [path] - Path to listen to, null or no value will listen to all changes.
     * @param {ValueManagerListener} listener - The listener to execute.
     * @param {Object} [scope] - The scope to execute the listener in.
     * @param {boolean|Function}  init - true or a function will execute when the listener is added.
     * */

    this.addValidateListener = addListener(this.validateListeners, tu.noop, tu.noop);
    /**
     * Removes a validate listener.
     * @param {String} [path] -  path to remove.
     * @param {Function} [ValueManagerListener] - the listener to look for.
     * @param {Listener} [listener] - the listener returned from addListener();
     */
    this.removeValidateListener = removeListener(this.validateListeners);

    this.createListeners = [];
    this.addCreateValueListener = addListener(this.createListeners);
    this.removeCreateValueListener = removeListener(this.createListeners);

    this.submitListeners = [];
    /**
     * adds a submit listener.
     * @param {String} [path] -  path to listen to.
     * @param {Function} [ValueManagerListener] - the listener to look for.
     * @param {Listener} [listener] - the listener returned from addListener();
     */
    this.addSubmitListener = addListener(this.submitListeners);
    /**
     * removes a submit listener;
     */
    this.removeSubmitListener = removeListener(this.submitListeners);

    /**
     * adds a submit listener.
     * @param {String} [path] -  path to listen to.
     * @param {Function} [ValueManagerListener] - the listener to look for.
     * @param {Listener} [listener] - the listener returned from addListener();
     */
    this.addStateListener = addListener(this.stateListeners);
    /**
     * removes a submit listener;
     */
    this.removeStateListener = removeListener(this.stateListeners);
}

ValueManager.prototype = {
    createValueManager(value, errors, path){
        var vm = ValueManager(value, errors);
        vm.addCreateValueListener(null, this.onCreateValueManager, this);
        this.onCreateValueManager(vm, path);
        return vm;
    },
    onCreateValueManager(vm, path){
        var v, i = 0, l = this.createListeners.length
        for (; i < l; i++) {
            var v = this.createListeners[i];
            if (!(v.path == null || v.path === path))
                continue;
            if (v.listener.call(v.scope, vm, path) === false) {
                return false;
            }
        }
        return true;
    },
    /**
     * Removes all listeners, both error and value.
     */
        removeAll()
    {
        this.listeners.length = 0;
        this.errorListeners.length = 0;
        this.validateListeners.length = 0;
        this.createListeners.length = 0;
        this.submitListeners.length = 0;
        this.stateListeners.length = 0;
    }
    ,
    /**
     * When onSubmit is called this is fired
     */
    onSubmit: function (e, value, errors, path) {
        var parts = path && path.split('.') || [], i = 0, l = parts.length, pp = null;
        do {
            if (this.submitListeners.some(v=> {
                    if (v.path == null || v.path === pp) {
                        return (v.listener.call(v.scope, e, value, errors, path) === false);
                    }
                }, this) === true) {
                return false
            }
            pp = tu.path(pp, parts[i]);
        } while (i++ < l);
        return true;
    },

    /**
     * Triggers the value change on all listeneners.
     */
        onValueChange(path, value, oldValue)
    {
        var parts = path && path.split('.') || [], i = 0, l = parts.length, pp = null;
        do {
            if (this.listeners.some(v=> {
                    if (v.path === pp) {
                        return (v.listener.call(v.scope, this.path(pp, this.value), this.path(pp, this.oldValue), path) === false);
                    }
                }, this) === true) {
                return false
            }
            pp = tu.path(pp, parts[i]);
        } while (i++ < l);
        return true;
    }
    ,
    /**
     * Returns the path of an object
     * @param {String} - a dot deliminted string.
     * @param {Object} [object] - defaults to the current value.
     */
        path(p, obj)
    {
        if (arguments.length < 2) {
            obj = this.value;
        }
        if (!p) return obj;

        var parts = p.split('.');

        for (var i = 0, l = parts.length; i < l; i++) {
            var key = parts[i];
            if (obj == null || !(key in obj)) {
                return null;
            }
            obj = obj[key];
        }
        return obj;
    }
    ,
    /**
     * Updates the value at a given path. This will trigger the value listeners.
     * @param {String} path - Path to update
     * @param {*} value - Value to update.argument.
     */
        update(path, value)
    {
        var parts = path.split('.'), obj = this.value || (this.value = {}), oobj = this.oldValue, last = parts[parts.length - 1];

        for (var i = 0, l = parts.length - 1; i < l; i++) {
            var key = parts[i];

            if (key in obj) {
                //We won't build the oobj tree, we may need to in the case of multiple changes to the object.  The question becomes
                // are old values the original values or the last change.
                oobj = oobj && oobj[key];

                //We copy it so that when oldValues and value share a nested object, they do not conflict, but we only need to do it when
                // they are referencing the same instance, note we are parts -1 levels up, so really only arrays and objects.
                obj = obj[key] = (oobj === obj[key]) ? copy(obj[key]) : obj[key];
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
        if (value === void(0)) {
            delete obj[last];
        } else {
            obj[last] = value;
        }
        //We will build a path for the new value, but not for the oldvalue.   This
        // might break whean a value changes multiple times.
        return this.onValueChange(path, value, oobj && oobj[last]) !== false;
    }
    ,
    /**
     * Returns the current value.
     */
        getValue()
    {
        return this.value;
    }
    ,
    /**
     * @param {Object} value - The new value for the params.  Will trigger
     * changes on all listeners.
     */
        setValue(value)
    {
        this.oldValue = tu.extend({}, this.value);
        this.value = tu.extend({}, value);
        if (this._setValue(value, this.oldValue) !== false) {

        }
    }
    ,
    _keys()
    {
        var args = Array.prototype.slice.call(arguments).map(function (v) {
            return (canDescend(v) ? Object.keys(v) : null);
        });
        return tu.unique(Array.prototype.concat.apply([], args).filter(tu.nullCheck));

    }
    ,
    _setValue(value, oldValue, path)
    {
        if (canDescend(value) || canDescend(oldValue)) {
            this._keys(value, oldValue).forEach(function (key) {
                this._setValue(value && value[key], oldValue && oldValue[key], tu.path(path, key));
            }, this);
        } else {
            return this.onValueChange(path, value, oldValue);
        }

    }
    ,
    /**
     * Triggers error handlers.
     * @param {String} path - path to trigger the error.
     * @param {Object[]} errors - Errors to set.
     * @param {String} errors.name - Name of the error.
     * @param {String} errors.message - Message of the error.
     */
        onError(path, errors, value)
    {
        errors = errors && errors[0] ? errors : null;
        var oErrors = this.errors || {}, listeners = this.errorListeners;

        return listeners.some((v)=> {
            if (path == null || v.path == null || v.path === path || path.indexOf(v.path + '.') === 0) {
                return (v.listener.call(v.scope, errors, oErrors[path], path, value) === false);
            }
        }, this);

    }
    ,
    /**
     * Sets the current errors and triggers the error listeners.
     *
     * @param {Object} errors - object containing errors. The key is the full qualified path to the value in error
     *
     */
        setErrors(errors)
    {
        var keys = this._keys(errors, this.errors);
        this.errors = tu.extend({}, errors);
        return keys.some(function (key) {
                return this.onError(key, this.errors[key]);
            }, this) !== true;
    }
    ,
    getErrors()
    {
        var ret = {};
        Object.keys(this.errors).filter(function (v) {
            return this[v] != null;
        }, this.errors).forEach(function (v) {
            ret[v] = this[v];
        }, this.errors);
        return ret;
    }
    ,
    updateErrors(path, errors, value)
    {
        errors = Array.isArray(errors) ? errors : [errors];
        errors = errors && errors[0] ? errors : null;
        this.errors[path] = errors;
        this.onError(path, errors, value);
    }
    ,
    errorsFor(path)
    {
        var pathe = path + '.', keys = Object.keys(this.errors).filter(function (key) {
            return this[key] != null && (path == null || key === path || key.indexOf(pathe) === 0);
        }, this.errors), errors = [];

        if (keys.length < 2) {
            return this.errors[keys[0]];
        }
        keys.forEach(function (key) {
            tu.push(errors, this[key]);
        }, this.errors);
        return errors;
    }
    ,
    /**
     * Trigger the validators.
     *
     */
        validate(path, value)
    {
        var pp = path && path + '.';
        this.validateListeners.forEach(function ValueManager$validate$forEach(v) {
            if (path == null || v.path === path || pp.indexOf(path) === 0)
                v.listener.call(v.scope, path, value);
        });
    },
    /**
     * Trigger Validators And Callback with Errors for paths.
     */
        validatePaths(paths, callback){
        var copyPaths = paths && paths.concat() || [];
        var errors;
        paths.forEach(function validatePaths$forEach(path) {
            function error$callback(error) {
                if (error) {
                    errors = errors || {};
                    errors[path] = error;
                }
                copyPaths.splice(copyPaths.indexOf(path), 1);
                if (copyPaths.length === 0 && callback) {
                    callback(errors);
                }
            }

            this.addErrorListener(path, error$callback, this).once();
            this.validate(path);
        }, this);
        return errors;
    },
    /**
     * Pretty much the same as update, except that it does not, store
     * the values.  It just fires, listeners.
     */
        updateState(path, value){
        return this.onChangeState(path, value) !== false;
    },
    onChangeState(path, value){
        var parts = path && path.split('.') || [], i = 0, l = parts.length, pp = null;
        do {
            if (this.stateListeners.some((v)=> {
                    if (v.path === pp) {
                        return (v.listener.call(v.scope, value, path) === false);
                    }
                }, this) === true) {
                return false
            }
            pp = tu.path(pp, parts[i]);
        } while (i++ < l);
        return true;
    }
}

module.exports = ValueManager;