"use strict";
var warnings = require('fbjs/lib/warning');

/**
 *
 *  This Mixin is used to add error and value manager listeners.
 *  usage
 *  mixins:[require('./ValueManagerListenerMixin'],
 *  getDefaultProps(){
 *  listeners:{
 *   'path.to.listen':'handler';
 *   // . == this.props.path
 *   '.':'listenToPathProp'
 *   //
 *   '.stuff':'listenToPathPropPlusStuff'
 *
 *  },
 *  //same rules but listenens to ErrorListeners.
 *  errorListeners:{
 *
 *  }
 *  }
 *
 */

function remove(v) {
    if (v) {
        v.remove();
    }
}
function _key(path, key) {
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
function invoke(obj, func) {
    if (typeof func === 'function') return func;
    if (typeof obj[func] === 'function') return obj[func];
    if (func == null) {
        ("production" !== process.env.NODE_ENV ? warning(
            false,
            'Can not resolve %s to a function to be called with the event',
            func
        ) : null)
    }
    return function invoke$lazy() {
        if (typeof this[func] === 'function') {
            return this[func].apply(this, arguments);
        }
        ("production" !== process.env.NODE_ENV ? warning(
            false,
            'Can not resolve %s to a function to be called with the event',
            func
        ) : null);
    }
}
var ValueManagerListenerMixin = {
    createKey(key){
        return _key(this.__path, key);
    },
    registerErrorHandler(key, func, init){
        if (init == null) init = true;
        var handler = this.__valueManager.addErrorListener(this.createKey(key), invoke(this, func), this, init);
        this.__componentListeners.push(handler);
        return handler;
    },
    registerHandler(key, func, init){
        if (init == null) init = true;
        key = this.createKey(key)
        var handler = this.__valueManager.addListener(key, invoke(this, func), this, init);
        this.__componentListeners.push(handler);
        return handler;
    },
    _unlisten(){
        if (this.__componentListeners) {
            this.__componentListeners.forEach(remove);
            this.__componentListeners.length = 0;
        }
    },
    _listen(){
        this._unlisten();
        var errorListeners = this.errorListeners, listeners = this.listeners;
        this.__componentListeners = [];
        if (typeof errorListeners === 'function') {
            errorListeners = errorListeners();
        }
        if (typeof listeners === 'function') {
            listeners = listeners();
        }
        if (errorListeners) {
            Object.keys(errorListeners).forEach(function onComponentErrorListener$map(key) {
                var args = [key].concat(errorListeners[key])
                this.registerErrorHandler.apply(this, args);
            }, this);
        }
        if (listeners) {
            Object.keys(listeners).forEach(function onComponentListener$map(key) {
                var args = [key].concat(listeners[key]);
                this.registerHandler.apply(this, args);
            }, this);
        }
    },
    componentWillMount(){
        this.__path = this.props.path;
        this.__valueManager = this.props.valueManager;
        this._listen();
    },
    componentWillUnmount(){
        this._unlisten();
    },
    componentWillReceiveProps(props){
        if (!props.valueManager || (props.valueManager === this.props.valueManager && props.path === this.props.path)) {
            return;
        }
        this.__valueManager = props.valueManager;
        this.__path = props.path;
        this._listen();
    }
};
module.exports = ValueManagerListenerMixin;