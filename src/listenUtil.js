"use strict";

import PropTypes from './PropTypes'
import {each, extend, applyFuncs, result, FREEZE_ARR} from './tutils';
import warning from './warning';
import map from 'lodash/collection/map';

const DEFAULT_CONTEXT = {valueManager: PropTypes.valueManager};

export function resolveKey(path, key) {
    if (!key) {
        return path;
    }
    if (key[0] != '.') {
        return key;
    }
    var parts = path ? path.split('.') : [];
    key = key.substring(1);
    while (key[0] === '.') {
        key = key.substring(1);
        parts.pop();
    }
    if (key) {
        parts.push(key);
    }
    return parts.length === 0 ? null : parts.join('.');
}

export function invoke(obj, func) {
    if (typeof func === 'function') return func;
    if (typeof obj[func] === 'function') return obj[func];
    warning(
        func,
        'Can not resolve %s on %s to a function to be called with the event',
        func, obj
    )
    return function invoke$lazy() {
        if (typeof this[func] === 'function') {
            return this[func].apply(this, arguments);
        }
        warning(
            false,
            'Can not resolve %s to a function to be called with the event',
            func
        );
    }
}

function __unlisten(itm) {
    if (!(itm && itm.handler)) {
        return;
    }
    itm.handler.remove();
}
function __unlistenAndListen(itm) {
    __unlisten(itm);
    __listen.call(this, itm);
}
function __listen(itm) {
    itm.handler = this.context.valueManager[itm.method](resolveKey(this.props.path, itm.path), itm.listener, itm.scope, itm.init);
    return itm;
}

export function componentWillUnmount() {
    if (this.__listeners) {
        this.__listeners.forEach(__unlisten);
        this.__listeners.length = 0;
    }
}
export function componentWillReceiveProps(props, context) {
    if ((props.path === this.props.path && context.valueManager === this.context.valueManager)) {
        return;
    }
    if (this.__listeners)
        this.__listeners.forEach(__unlistenAndListen, {props, context});
}

//If the target has __listeners already then we will assume that this is ours.  We really
// should use a symbol for this, but then we would have to figure out how to reuse it.
// this is really pretty fast, 1 array can hold all the listener details.
/**
 * Sets up listeners and their lifecycle.
 * This should be used with fields.
 * @param Target
 * @param init
 * @param contextTypes
 */
export function wrapTargetWithContextTypes(Target, init, contextTypes) {
    setupContext(Target.constructor, contextTypes);
    return wrapTarget(Target, init);
}
export function wrapTarget(Target, init) {
    if (!Target.__listen$connect) {
        Target.__listen$connect = true;
        Target.componentWillUnmount = applyFuncs(Target.componentWillUnmount, componentWillUnmount);
        Target.componentWillReceiveProps = applyFuncs(Target.componentWillReceiveProps, componentWillReceiveProps);
    }
    if (init) {
        Target.componentWillMount = applyFuncs(function listenUtil$componentWillMount() {
            init.call(this, _addListenersTo.bind(this))
        }, Target.componentWillMount);
    }
    return Target;
}


function _addListenersTo(method, path, listener, init) {
    var itm = {method: MapTypes[method], path, listener: invoke(this, listener), init, scope: this};
    (this.__listeners || (this.__listeners = [])).push(itm);
    return __listen.call(this, itm);
}
/**
 * Remove a listener;
 *
 * @param listeners
 * @param itm
 * @returns {*}
 */
export function removeListener(listeners, itm) {
    __unlisten(itm);
    var idx = listeners.indexOf(itm);
    if (idx > -1) {
        listeners.splice(itm, 1);
    }
    return listeners;
}
export function addListenersTo(method, path, listener, init) {
    var itm = _addListenersTo.call(this, method, path, listener, init);
    return {
        remove: removeListener.bind(null, this.__listeners, itm)
    }
}

export function setupContext(Target, contextTypes = DEFAULT_CONTEXT) {
    if (!contextTypes) return;
    if (contextTypes) {
        Target.contextTypes = extend({}, Target.contextTypes, contextTypes);
    }
}

/**
 * The possible types of listeners that can be added.
 * @readonly
 * @enum {string}
 */
export const MapTypes = {
    'value': 'addListener',
    'error': 'addErrorListener',
    'submit': 'addSubmitListener',
    'state': 'addStateListener',
    'validate': 'addValidateListener',
    'addListener': 'addListener',
    'addErrorListener': 'addErrorListener',
    'addSubmitListener': 'addSubmitListener',
    'addStateListener': 'addStateListener',
    'addValidateListener': 'addValidateListener'
};