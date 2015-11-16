"use strict";

import PropTypes from '../PropTypes'
import {each, result, FREEZE_ARR} from '../tutils';
import warning from '../warning';
import map from 'lodash/collection/map';
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

function addResult(method, listeners, to) {
    if (listeners) {
        to.push({method, listeners, handlers: FREEZE_ARR});
    }
}

function __remove(handler) {
    handler && handler.remove();
}

function __unlisten(itm) {
    itm && itm.handlers.forEach(__remove);
}

export default function listenTo(listeners = "listeners",
                                 errorListeners = "errorListeners",
                                 stateListeners = "stateListeners",
                                 validateListeners = "validateListener",
                                 submitListeners = "submitListeners",
                                 createKey = _key) {

    return function (Target) {
        function __listen(itm) {
            var path = this.props.path, valueManager = this.context.valueManager;
            itm.handlers = map(itm.listeners, function (func, key) {
                return register(valueManager, itm.method, createKey(path, key), func);
            });
        }

        function __unlistenAndListen(itm) {
            __unlisten.call(this, itm);
            __listen(itm);

        }

        class ListenTo extends Target {
            constructor(props) {
                super(props);
                var listen = this.__listeners = [];
                addResult('addListener', result(this, listeners), listen);
                addResult('addStateListener', result(this, stateListeners), listen);
                addResult('addErrorListener', result(this, errorListeners), listen);
                addResult('addSubmitListener', result(this, submitListeners), listen);
                addResult('addValidationListener', result(this, validateListeners), listen);
            }

            componentWillMount() {
                super.componentWillMount && super.componentWillMount();
                this.__listeners.forEach(__listen, this);
            }

            componentWillUnmount() {
                super.componentWillUnmount && super.componentWillUnmount();
                this.__listeners.forEach(__unlisten);
            }

            componentDidUpdate() {
                this.__listeners.forEach(__unlistenAndListen, this);
            }
        }
        return ListenTo;
    }
}
