"use strict";

import {isFunction, returnFirst} from './tutils';
import warning from './warning';

/**
 * This callback is displayed as a global member.
 * It will call them in order of most distant to least distance path.
 * In the event of two paths being the same distance, it will call the last
 * added first.
 *
 * @callback ValueManagerListener
 * @param {*} newValue - The new value to be updated
 * @param {*} oldValue - The previous value updated.
 * @param {String} path - The path to value updated
 */
export default function eventable(listeners, find = returnFirst, findOld = returnFirst) {
    listeners = listeners || [];

    //Remove if called more than once don't do anything.
    function remove() {
        const idx = listeners.indexOf(this);
        if (idx > -1) {
            listeners.splice(idx, 1);
        }
        return this;
    }

    function once() {
        const rem = this.remove, listener = this.listener, self = this;

        this.listener = function (...args) {
            var ret = listener.apply(self, ...args);
            rem();
            return ret;
        };
        return this;
    }

    /**
     * @param path {string}
     * @param listener {function}
     * @param scope {object}
     * @param init {boolean|function}
     */
    return function eventable$addListener(path, listener, scope, init) {
        if (listener == null) {
            warning(listener, 'trying to add a null listener %s', path)
            return;
        }
        var obj = {path, listener, scope, once};
        obj.remove = obj::remove;
        init = init === true ? obj.listener : isFunction(init) ? init : null;
        if (init) {
            init.call(obj.scope, find(path), findOld(path), path)
        }
        if (listeners.length === 0) {
            listeners.push(obj)
        } else {
            var plength = path ? path.split('.').length : 0;
            for (var i = 0, l = listeners.length; i < l; i++) {

                var lp = listeners[i].path, cllength = lp ? lp.split('.').length : 0;

                if (plength >= cllength || i + 1 === l) {
                    listeners.splice(i, 0, obj);
                    break;
                }
            }
        }
        return obj;
    }
}
