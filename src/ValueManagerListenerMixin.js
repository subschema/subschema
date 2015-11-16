"use strict";

var PropTypes = require('./PropTypes');
var warning = require('./warning');
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

var ValueManagerListenerMixin = {
    contextTypes: {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader
    },

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
        var handler = this.__valueManager.addListener(this.createKey(key), invoke(this, func), this, init);
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
                this.registerErrorHandler.apply(this, [key].concat(errorListeners[key]));
            }, this);
        }
        if (listeners) {
            Object.keys(listeners).forEach(function onComponentListener$map(key) {
                this.registerHandler.apply(this, [key].concat(listeners[key]));
            }, this);
        }
    },
    componentWillMount(){
        //is this wrong, it feels so right, and I really don't want to pollute the namespace.
        this.componentWillReceiveProps(this.props, this.context);
    },
    componentWillUnmount(){
        this._unlisten();
    },
    componentWillReceiveProps(props, context){
        if (this.__path === props.path && this.__valueManager === context.valueManager) {
            return;
        }
        this.__path = props.path;
        this.__valueManager = context.valueManager;
        if (this.__valueManager) {
            this._listen();
        }
    }
};
module.exports = ValueManagerListenerMixin;