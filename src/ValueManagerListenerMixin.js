"use strict";
var warnings = require('react/lib/warning');

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
    v && v.remove();
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
        return _key(this.props.path, key);
    },
    registerErrorHandler(key, func, init){
        if (init == null) init = true;
        var props = this.props, handler = props.valueManager.addErrorListener(this.createKey(key), invoke(this, func), this, init);
        this._componentListeners.push(handler);
        return handler;
    },
    registerHandler(key, func, init){
        if (init == null) init = true;
        var props = this.props, handler = props.valueManager.addListener(this.createKey(key), invoke(this, func), this, init);
        this._componentListeners.push(handler);
        return handler;
    },

    componentWillMount(){
        var errorListeners = this.errorListeners, listeners = this.listeners;
        this._componentListeners = [];
        if (typeof errorListeners === 'function') {
            errorListeners = errorListeners();
        }
        if (typeof listeners === 'function') {
            listeners = listeners();
        }

        Object.keys(errorListeners || {}).forEach(function onComponentErrorListener$map(key) {
            var args = [key].concat(errorListeners[key])
            this.registerErrorHandler.apply(null, args);
        }, this);
        Object.keys(listeners || {}).forEach(function onComponentListener$map(key) {
            var args = [key].concat(listeners[key]);
            this.registerHandler.apply(null, args);
        }, this);
    },
    componentWillUnmount(){
        this._componentListeners.forEach(remove);
        this._componentListeners.length = 0;
    }
};
module.exports = ValueManagerListenerMixin;