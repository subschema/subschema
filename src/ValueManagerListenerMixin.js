"use strict";

import React from 'react';
import {addListenersTo, componentWillUnmount, resolveKey} from './listenUtil';
import listeners from './decorators/listeners';
var warning = require('./warning');
/**
 *
 *  Deprecated - Please decorators @listener or @listen
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


/**
 *
 */
export default class ValueManagerListenerMixin extends React.Component {

    createKey(key) {
        return resolveKey(this.props.path, key);
    }

    registerErrorHandler(key, func, init) {
        return addListenersTo.call(this, 'error', key, func, init);
    }

    registerHandler(key, func, init) {
        return addListenersTo.call(this, 'value', key, func, init);
    }

    _unlisten() {
        componentWillUnmount.call(this);
    }

    @listeners('value')
    _listen() {

        if (!this.listeners) {
            return;
        }
       // warning(false, 'ValueManagerListener is deprecated use decorators instead');
        if (typeof this.listeners === 'function') {
            return this.listeners();
        }
        return this.listeners;
    }

    @listeners('error')
    _errors() {
        if (!this.errorListeners) {
            return;
        }
    //    warning(false, 'ValueManagerListener is deprecated use decorators instead');
        if (typeof this.errorListeners === 'function') {
            return this.errorListeners();
        }
        return this.errorListeners;
    }

}
