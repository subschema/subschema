"use strict";
import defaultGet from 'lodash/object/get';
import __set from 'lodash/object/set';
import isPlainObject from 'lodash/lang/isPlainObject';
import {noop} from './tutils';

/**
 * Copy on write _set.
 * @param obj
 * @param key
 * @param value
 * @private
 */
function defaultSet(obj, key, value) {


    if (key != null) {
        const parts = key.split('.');
        if (parts.length > 1) {
            const last = parts.pop();
            const orig = defaultGet(obj, parts.join('.'));
            if (orig != null) {
                let copy;
                if (Array.isArray(orig)) {
                    copy = orig.concat();
                } else if (isPlainObject(orig)) {
                    copy = {...orig};
                }
                if (copy) {
                    __set(copy, last, value);
                    return __set(obj, parts.join('.'), copy);
                }
            }
        }
    } else {
        //if key is null we replace all the values with the values of value, if value exists.
        for (let key of Object.keys(obj)) {
            delete obj[key];
        }
        if (value != null) {
            Object.assign(obj, value);
        }
        return obj;
    }
    return __set(obj, key, value);
}

function _listener(_value, _map, _get = defaultGet) {
    return (path, listener, scope, init)=> {

        if (init) {
            if (init === true) {
                scope::listener(_get(_value, path), null, path);
            } else {
                scope::init(_get(_value, path), null, path);
            }
        }

        const ret = {
            path, listener, scope
        };
        ret.once = function () {
            ret.listener = function (...args) {
                const r = scope::listener(...args);
                ret.remove();
                return r;
            }
        };

        _map.add(ret);

        ret.remove = _map.delete.bind(_map, ret);

        return ret;

    };
}
function _removeListener(_map) {
    return (pathOrReference)=> {
        if (!pathOrReference) return;
        if (typeof pathOrReference === 'string') {
            const dotPt = pathOrReference == null ? '' : `${pathOrReference}.`;
            for (let entry of _map) {
                const {remove, path} = entry;
                if (path === pathOrReference || path.indexOf(dotPt) === 0 || `${path}.`.indexOf(dotPt) === 0) {
                    remove();
                }
            }
        } else if (pathOrReference.remove) {
            pathOrReference.remove();
        }
    };

}
function _update(_value, _map, _get = defaultGet, _set = defaultSet) {
    return (pt, _update)=> {
        _set(_value, pt, _update);
        const dotPt = pt == null ? '' : `${pt}.`;
        for (let entry of _map) {
            const {path, scope, listener} = entry;
            //wtf?


            if (path == null) {
                console.log('firing');
                scope::listener(_value, null, path, pt);
            } else if (path === pt || path.indexOf(dotPt) === 0 || dotPt.indexOf(`${path}.`) === 0) {
                const gv = _get(_value, path)
                scope::listener(gv, null, path, pt);
            }
        }
    };
}
function errorSet(obj, key, value) {
    if (value == null || value.length === 0) {
        delete obj[key];
    } else {
        obj[key] = value;
    }
}

function errorGet(obj, key) {
    return obj[key];
}

function FastValueManager(_argValue = {}, _argErrors = {}) {
    if (!(this instanceof FastValueManager)) {
        return new FastValueManager(_argValue, _argErrors);
    }


    const map = this.listeners = new Set();
    this.errors = new Set();
    const validators = this.validators = new Set();

    const value = {..._argValue};
    const errors = {..._argErrors};

    this.getValue = ()=> {

        return {...value};
    };

    this.getErrors = ()=> {
        if (Object.keys(errors).length == 0) {
            return null;
        }
        return {...errors};
    };

    this.setValue = (newValue)=> {
        this.update(null, newValue);
    };


    this.path = defaultGet.bind(null, value);
    this.update = _update(value, map);
    this.addListener = _listener(value, map);
    this.addValidateListener = _listener(null, validators, noop, noop);
    this.removeListener = _removeListener(map);
    /**
     * Trigger the validators.
     *
     */
    this.validate = _update(null, this.validators, (obj, p)=>this.path(p), noop);

    /**
     * Trigger Validators And Callback with Errors for paths.
     */
    this.validatePaths = (paths = [], callback = noop)=> {
        let _errors = null;
        for (let p in paths) {
            this.validate(p);
            if (errors[p]) {
                if (_errors == null) {
                    _errors = {};
                }
                _errors = this.errors[p];
            }
        }

        callback(_errors);

        return _errors;
    };

    const _updateErrors = _update(errors, this.errors, errorGet, errorSet);

    this.updateErrors = function (path, errs) {
        if (errs && !Array.isArray(errs)) {
            errs = [errs];
        }
        _updateErrors(path, errs);
    };

    this.addErrorListener = _listener(errors, this.errors, errorGet);

    this.removeErrorListener = _removeListener(this.errors);

}
export default FastValueManager;