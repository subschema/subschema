"use strict";

import PropTypes from './PropTypes'
import {each, result, FREEZE_ARR} from './tutils';
import warning from './warning';
import map from 'lodash/collection/map';


export function remove(v) {
    if (v) {
        v.remove();
    }
}
export function resolveKey(path, key) {
    if (!key) {
        return path;
    }
    if (key[0] != '.') {
        return key;
    }
    var parts = path.split('.');
    key = key.substring(1);
    while (key[0] === '.') {
        key = key.substring(1);
        parts.pop();
    }
    if (key) {
        parts.push(key);
    }
    return parts.join('.');
}

export function invoke(obj, func) {
    if (typeof func === 'function') return func;
    if (typeof obj[func] === 'function') return obj[func];
    warning(
        func == null,
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

export function addResult(method, listeners, to) {
    if (listeners) {
        to.push({method, listeners, handlers: FREEZE_ARR});
    }
}

export function register(valueManager, method, func, scope, init) {
    return valueManager[method](func, scope || this, init == null ? true : init);
}

function __unlisten(itm) {
    itm && itm.handlers.forEach(remove);
}
function __unlistenAndListen(itm) {
    __unlisten(itm);
    __listen.call(this, itm);
}
function __listen(itm) {
    var path = this.props.path, valueManager = this.context.valueManager;
    itm.handlers = map(itm.listeners, function (func, key) {
        var init = true;
        if (Array.isArray(func)){
            init = func[1];
            func = func[0];
        }
        return valueManager[itm.method](resolveKey(path, key), func, this, init == null ? true : init);
    }, this);
}

export function componentWillMount() {
    this.__listeners.forEach(__listen, this);
}
export function componentWillUnmount() {
    this.__listeners.forEach(__unlisten);
}
export function componentWillReceiveProps(props, context) {
    if ((props.path === this.props.path && context.valueManager === this.context.valueManager)) {
        return;
    }
    this.__listeners.forEach(__unlistenAndListen, {props, context});
}

export function applyFuncs(f1, f2) {
    if (f1 && !f2) return f1;
    if (!f1 && f2) return f2;
    return function () {
        f1.apply(this, arguments);
        f2.apply(this, arguments);
    }
}

export const mapTypes = {
    'value': 'addListener',
    'error': 'addErrorListener',
    'submit': 'addSubmitListener',
    'state': 'addStateListener'
}