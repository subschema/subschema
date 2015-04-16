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

function addListener(listeners, find, findOld) {
    return function ValueManager$addListener(path, listener, scope, init) {
        if (tu.isFunction(path)) {
            listener = path;
            path = null
        }
        if (listener == null) {
            return;
        }
        var obj = {path, listener, scope};

        init = init === true ? obj.listener : tu.isFunction(init) ? init : null;
        if (init) {
            init.call(obj.scope, find(path), findOld(path), path)
        }
        listeners.push(obj);
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
    removeAll(){
        this.listeners.length = 0;
        this.errorListeners.length = 0;
    },


    onValueChange(path, value, oldValue){
        var parts = path && path.split('.') || [], i = 0, l = parts.length;
        var pp;
        do {
            if (this.listeners.some(v=> {
                    if (v.path == null && i === 0 || v.path === pp) {
                        return (v.listener.call(v.scope, this.path(pp, this.value), this.path(pp, this.oldValue), path) === false);
                    }
                }, this) === true) {
                return false
            }
            pp = tu.path(pp, parts[i]);
        } while (i++ < l);
    },
    path(p, obj){
        if (arguments.length < 2) {
            obj = this.value;
        }
        if (!p) return obj;

        var parts = p.split('.');

        for (let i = 0, l = parts.length; i < l; i++) {
            let key = parts[i];
            if (obj == null || !(key in obj)) {
                return null;
            }
            obj = obj[key];
        }
        return obj;
    },
    update(path, value){
        var parts = path.split('.'), obj = this.value || (this.value = {}), oobj = this.oldValue, last = parts[parts.length - 1];

        for (let i = 0, l = parts.length - 1; i < l; i++) {
            let key = parts[i];

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

        obj[last] = value;

        //We will build a path for the new value, but not for the oldvalue.   This
        // might break whean a value changes multiple times.
        return this.onValueChange(path, value, oobj && oobj[last]) !== false;
    },
    getValue(){
        return this.value;
    },
    setValue(value){
        this.oldValue = tu.extend({}, this.value);
        this.value = tu.extend({}, value);
        if (this._setValue(value, this.oldValue) !== false) {

        }
    },
    _keys(){
        var args = Array.prototype.slice.call(arguments).map(function (v) {
            return (canDescend(v) ? Object.keys(v) : null);
        });
        return tu.unique(Array.prototype.concat.apply([], args).filter(tu.nullCheck));

    },
    _setValue(value, oldValue, path){
        if (canDescend(value) || canDescend(oldValue)) {
            this._keys(value, oldValue).forEach(function (key) {
                this._setValue(value && value[key], oldValue && oldValue[key], tu.path(path, key));
            }, this);
        } else {
            return this.onValueChange(path, value, oldValue);
        }

    },
    onError(path, errors){
        errors = errors && errors[0] ? errors : null;
        var oErrors = this.errors || {}, listeners = this.errorListeners;

        return listeners.some((v)=> {
            if (path == null || v.path == null || v.path === path || path.indexOf(v.path + '.') === 0) {
                return (v.listener.call(v.scope, errors, oErrors[path], path) === false);
            }
        }, this);

    },
    setErrors(errors){
        var keys = this._keys(errors, this.errors);
        this.errors = tu.extend({}, errors);
        return keys.some(function (key) {
                return this.onError(key, this.errors[key]);
            }, this) !== true;
    },
    getErrors(){
        var ret = {};
        Object.keys(this.errors).filter(function (v) {
            return this[v] != null;
        }, this.errors).forEach(function (v) {
            ret[v] = this[v];
        }, this.errors);
        return ret;
    },
    updateErrors(path, errors){
        errors = Array.isArray(errors) ? errors : [errors];
        errors = errors && errors[0] ? errors : null;
        this.errors[path] = errors;
        this.onError(path, errors);
    },
    errorsFor(path){
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
    },
    /**
     * Trigger the validators.
     *
     */
        validate(path){
        var pp = path && path + '.';
        this.validateListeners.forEach(function ValueManager$validate$forEach(v) {
            if (path == null || v.path === path || pp.indexOf(path) === 0)
                v.listener.call(v.scope, path);
        });
    }
}

module.exports = ValueManager;