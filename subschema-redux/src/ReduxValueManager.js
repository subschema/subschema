"use strict";
import {createStore as _createStore, combineReducers, applyMiddleware, compose} from 'redux'
import _get from 'lodash/get';
import castPath from 'lodash/_castPath'

import _middleware from './middleware';
import _reducers from './reducers';
import {update, validate, submit, state, error} from './events';
import  tutils from 'subschema/../tutils';
import  eventable from 'subschema/../eventable';

const {
    noop,
    push,
    FREEZE_ARR
} = tutils;
const tpath = tutils.path;

/**
 * Value manager listens and changes values on the objects.
 * It can be passed a property to any subschema type, or form.
 *
 * @param value
 * @param errors
 * @returns {ValueManager}
 * @constructor
 */
export default function ReduxValueManager(value, errors, createStore = _createStore, reducers = _reducers, middleware = _middleware) {
    if (!(this instanceof ReduxValueManager)) {
        return new ReduxValueManager(value, errors, createStore, reducers, middleware);
    }
    const listeners = [];
    const errorListeners = [];
    const validateListeners = [];
    const stateListeners = [];
    const submitListeners = [];
    const valuePath = path => _get(this.getValue(), path, null);

    /**
     * Adds a value listener
     * @param {String} [path] - Path to listen to, null or no value will listen to all changes.
     * @param {ValueManagerListener} listener - The listener to execute.
     * @param {Object} [scope] - The scope to execute the listener in.
     * @param {boolean|Function}  init - true or a function will execute when the listener is added.
     * */
    this.addListener = eventable(listeners, valuePath, valuePath);
    /**
     * Adds an error  listener
     * @param {String} [path] - Path to listen to, null or no value will listen to all changes.
     * @param {ValueManagerListener} listener - The listener to execute.
     * @param {Object} [scope] - The scope to execute the listener in.
     * @param {boolean|Function}  init - true or a function will execute when the listener is added.
     * */
    this.addErrorListener = eventable(errorListeners, (prop)=>this.errorsFor(prop), noop);

    /**
     * Adds a validate  listener
     * @param {String} [path] - Path to listen to, null or no value will listen to all changes.
     * @param {ValueManagerListener} listener - The listener to execute.
     * @param {Object} [scope] - The scope to execute the listener in.
     * @param {boolean|Function}  init - true or a function will execute when the listener is added.
     * */

    this.addValidateListener = eventable(validateListeners, noop, noop);

    /**
     * adds a submit listener.
     * @param {String} [path] -  path to listen to.
     * @param {Function} [ValueManagerListener] - the listener to look for.
     * @param {Listener} [listener] - the listener returned from eventable();
     */
    this.addSubmitListener = eventable(submitListeners);

    /**
     * adds a submit listener.
     * @param {String} [path] -  path to listen to.
     * @param {Function} [ValueManagerListener] - the listener to look for.
     * @param {Listener} [listener] - the listener returned from eventable();
     */
    this.addStateListener = eventable(stateListeners);


    const onValueChange = (state, oldState, path)=> {
        var parts = path == null ? FREEZE_ARR : castPath(path), i = 0, l = parts.length, pp = null;
        do {
            if (listeners.some(v=> {
                    if (v.path === pp) {
                        return (v.listener.call(v.scope, _get(state, pp, null), _get(oldState, pp, null), path && path.join('.')) === false);
                    }
                }, this) === true) {
                return false
            }
            pp = tpath(pp, parts[i]);
        } while (i++ < l);
        return true;
    };

    const onError = (errors, oldErrors, path)=> errorListeners.some((v)=> {
        if (path == null || v.path == null || v.path === path || path.indexOf(v.path + '.') === 0) {
            return (v.listener.call(v.scope, errors && errors[path], oldErrors && oldErrors[path], path, this.path(path)) === false);
        }
    });

    const onChangeState = (state, oldValue, path)=> stateListeners.some((v)=> {
        if (path == null || v.path == null || v.path === path || path.indexOf(v.path + '.') === 0) {
            return (v.listener.call(v.scope, state && state[path], oldValue && oldValue[path], path, this.path(path)) === false);
        }
    });

    const onValidate = (value, path)=> {

        var pp = path && path + '.';
        validateListeners.forEach(function ValueManager$validate$forEach(v) {
            if (path == null || v.path === path || pp.indexOf(path) === 0)
                v.listener.call(v.scope, path, value);
        });
    };

    const onSubmit = (value, errors, event, path)=> {
        var parts = path && path.split('.') || [], i = 0, l = parts.length, pp = null;
        do {
            if (submitListeners.some(v=> {
                    if (v.path === pp) {
                        return (v.listener.call(v.scope, event, errors, value, path) === false);
                    }
                }, this) === true) {
                return false
            }
            pp = tpath(pp, parts[i]);
        } while (i++ < l);
        return true;
    };
    this.removeAll = ()=>[errorListeners, listeners, submitListeners, stateListeners, validateListeners].forEach(removeAll, this);


    const store = createStore(reducers, applyMiddleware(middleware({
        value: onValueChange,
        error: onError,
        state: onChangeState,
        validate: onValidate,
        submit: onSubmit,
        getValue: ()=>this.getState().value,
        getState: ()=>this.getState().state,
        getError: ()=>this.getState().error

    })));

    this.getState = store.getState.bind(store);
    this.dispatch = store.dispatch.bind(store);
    this.replaceReducer = store.replaceReducer.bind(store);
    this.subscribe = store.subscribe.bind(store);
    this.getStore = ()=>store;

    this.setValue(value);
    this.setErrors(errors);

}

function remove(v) {
    v && v.remove && v.remove();
}
function removeAll(v) {
    var listeners = this[v];
    if (listeners) {
        listeners.forEach(remove);
        listeners.length = 0;
    }

}
ReduxValueManager.prototype = {
    removeListener(...args){
        args.forEach(remove);
    }
    /**
     * Removes all listeners, both error and value.
     */

    ,
    /**
     * Returns the path of an object
     * @param {String} - a dot deliminted string.
     * @param {Object} [object] - defaults to the current value.
     */
    path(p, obj)
    {
        if (arguments.length < 2) {
            obj = this.getValue();
        }
        if (!p) return obj;

        return _get(obj, p, null);
    }

    ,
    /**
     * Updates the value at a given path. This will trigger the value listeners.
     * @param {String} path - Path to update
     * @param {*} value - Value to update.argument.
     */
    update(path, value)
    {
        update(this.dispatch)(path, value)
    }
    ,
    /**
     * Returns the current value.
     */
    getValue()
    {
        return this.getState().value;
    }
    ,
    /**
     * @param {Object} value - The new value for the params.  Will trigger
     * changes on all listeners.
     */
    setValue(value)
    {
        update(this.dispatch)(null, value);
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
        error(this.dispatch)(null, errors);
    }
    ,
    getErrors()
    {
        return this.getState().error;
    }
    ,
    updateErrors(path, errors, value)
    {
        error(this.dispatch)(path, errors == null ? null : Array.isArray(errors) ? errors : [errors], value);
    }
    ,
    errorsFor(path)
    {
        const thisErrors = this.getState().error;
        const errors = [];
        const pathe = path + '.';
        const keys = Object.keys(thisErrors).filter(function (key) {
            return this[key] != null && (path == null || key === path || key.indexOf(pathe) === 0);
        }, thisErrors);

        if (keys.length < 2) {
            return thisErrors[keys[0]];
        }
        keys.forEach(function (key) {
            push(errors, this[key]);
        }, thisErrors);
        return errors;
    }
    ,
    /**
     * Trigger the validators.
     *
     */
    validate(path, value)
    {
        return validate(this.dispatch)(path, value);
    }
    ,
    /**
     * Trigger Validators And Callback with Errors for paths.
     */
    validatePaths(paths, callback)
    {
        return Promise.all(paths.map(path =>this.validate(path, this.path(path)))).then(()=> {
            const allErrors = this.getErrors();
            const errors = Object.keys(allErrors).reduce(function (ret, key) {
                if (allErrors[key]) {
                    if (!ret)
                        ret = {[key]: allErrors[key]};
                    else {
                        ret[key] = allErrors[key];
                    }
                }
                return ret;
            }, null);

            callback && callback(errors);
            return errors;
        });
    }
    ,
    /**
     * Pretty much the same as update, but here as
     * a way of seperating data in forms and such
     * from state.
     * */
    updateState(path, value)
    {
        return state(this.dispatch)(path, value);
    },
    copy()
    {
        return new ReduxValueManager(this.getValue(), this.getErrors());
    },
    onSubmit(event, errors, value, resolvedPath){
        return submit(this.dispatch)(resolvedPath, errors, value, event);

    }
};


ReduxValueManager.reducers = _reducers;
ReduxValueManager.middleware = _middleware;
ReduxValueManager.createStore = _createStore;
