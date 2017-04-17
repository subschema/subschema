"use strict";

import {push, path as tpath, unique, noop, extend, isBoolean, isString, isDate, isArray, isNumber} from "./tutils";
import eventable from "./eventable";

function reduceKeys(arr, v, b, c) {
    if (canDescend(v)) {
        push(arr, Object.keys(v))
    }
    return arr;
}
const has = Function.call.bind(Object.prototype.hasOwnProperty);
function canDescend(obj) {
    if (obj == null || isNumber(obj) || isBoolean(obj) || isString(obj) || isDate(obj) || isArray(obj)) {
        return false;
    }
    return true;
}
function copy(obj) {
    return obj == null ? null : isArray(obj) ? obj.slice(0) : extend({}, obj);
}

function _keys(...args) {
    return unique(args.reduce(reduceKeys, []));

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
export default function ValueManager(value, errors) {
    if (!(this instanceof ValueManager)) {
        return new ValueManager(value, errors);
    }
    this.listeners = [];
    this.errorListeners = [];
    this.validateListeners = [];
    this.stateListeners = [];
    this.setValue(value || {});
    this.setErrors(errors);
    this.oldValue = extend({}, this.value);


    var self = this;

    /**
     * Adds a value listener
     * @param {String} [path] - Path to listen to, null or no value will listen to all changes.
     * @param {ValueManagerListener} listener - The listener to execute.
     * @param {Object} [scope] - The scope to execute the listener in.
     * @param {boolean|Function}  init - true or a function will execute when the listener is added.
     * */
    this.addListener = eventable(this.listeners, function (prop) {
        return self.path(prop, self.value);
    }, function (prop) {
        return self.path(prop, self.oldValue);
    });
    /**
     * Adds an error  listener
     * @param {String} [path] - Path to listen to, null or no value will listen to all changes.
     * @param {ValueManagerListener} listener - The listener to execute.
     * @param {Object} [scope] - The scope to execute the listener in.
     * @param {boolean|Function}  init - true or a function will execute when the listener is added.
     * */
    this.addErrorListener = eventable(this.errorListeners, function (prop) {
        return self.errorsFor(prop);
    }, noop);

    /**
     * Adds a validate  listener
     * @param {String} [path] - Path to listen to, null or no value will listen to all changes.
     * @param {ValueManagerListener} listener - The listener to execute.
     * @param {Object} [scope] - The scope to execute the listener in.
     * @param {boolean|Function}  init - true or a function will execute when the listener is added.
     * */

    this.addValidateListener = eventable(this.validateListeners, noop, noop);

    this.submitListeners = [];
    /**
     * adds a submit listener.
     * @param {String} [path] -  path to listen to.
     * @param {Function} [ValueManagerListener] - the listener to look for.
     * @param {Listener} [listener] - the listener returned from eventable();
     */
    this.addSubmitListener = eventable(this.submitListeners);

    /**
     * adds a submit listener.
     * @param {String} [path] -  path to listen to.
     * @param {Function} [ValueManagerListener] - the listener to look for.
     * @param {Listener} [listener] - the listener returned from eventable();
     */
    this.addStateListener = eventable(this.stateListeners);

}

function remove(v) {
    v && v.remove && v.remove();
}
var listenersTypes = ['listeners', 'errorListeners', 'validateListeners', 'stateListeners', 'submitListeners'];
function removeAll(v) {
    var listeners = this[v];
    if (listeners) {
        listeners.forEach(remove);
        listeners.length = 0;
    }

}
ValueManager.prototype = {
    removeListener(...args){
        args.forEach(remove);
    },
    /**
     * Removes all listeners, both error and value.
     */
    removeAll()
    {
        listenersTypes.forEach(removeAll, this);
    }
    ,
    /**
     * When onSubmit is called this is fired
     */
    onSubmit: function (e, errors, value, path) {
        var parts = path && path.split('.') || [], i = 0, l = parts.length, pp = null;
        do {
            if (this.submitListeners.some(v=> {
                    if (v.path === pp) {
                        return (v.listener.call(v.scope, e, errors, value, path) === false);
                    }
                }, this) === true) {
                return false
            }
            pp = tpath(pp, parts[i]);
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
            pp = tpath(pp, parts[i]);
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
            if (obj == null || !(has(obj, key))) {
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

            if (has(obj, key)) {
                //We won't build the oobj tree, we may need to in the case of multiple changes to the object.  The question becomes
                // are old values the original values or the last change.
                oobj = oobj && oobj[key];

                //We copy it so that when oldValues and value share a nested object, they do not conflict, but we only need to do it when
                // they are referencing the same instance, note we are parts -1 levels up, so really only arrays and objects.
                if (obj[key] == null) {
                    if (/^\d+?$/.test(key)) {
                        obj = obj[key] = []
                    } else {
                        obj = obj[key] = {}
                    }
                } else {
                    obj = obj[key] = (oobj === obj[key]) ? copy(obj[key]) : obj[key];
                }
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
        this.oldValue = extend({}, this.value);
        this.value = extend({}, value);
        if (this._setValue(value, this.oldValue) !== false) {

        }
    }

    ,
    _setValue(value, oldValue, path)
    {
        if (canDescend(value) || canDescend(oldValue)) {
            _keys(value, oldValue).forEach(function (key) {
                this._setValue(value && value[key], oldValue && oldValue[key], tpath(path, key));
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
        var keys = _keys(errors, this.errors);
        this.errors = extend({}, errors);
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
        errors = isArray(errors) ? errors : [errors];
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
            push(errors, this[key]);
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
        let errors = null;
        paths.forEach(path => {
            //validate does not return the error, it just triggers the error handler,
            // so we add a listener for that path, trigger it and remove the listener.
            //  so that we can get the listener.  We should probably change validate
            // to return the error (or a promise) but not today.
            this.addErrorListener(path, (e)=> {
                if (e) {
                    (errors == null ? (errors = {}) : errors)[path] = e;
                }
            }).once();
            this.validate(path);
        }, this);

        if (callback) {
            callback(errors);
        }
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
            pp = tpath(pp, parts[i]);
        } while (i++ < l);
        return true;
    },
    copy(){
        return new ValueManager(this.getValue(), this.getErrors());
    }
}
