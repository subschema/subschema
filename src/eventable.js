"use strict";

import tutils from './tutils';
import warning from './warning';

var { isFunction, returnFirst } = tutils;
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

    function remove() {
        listeners.splice(listeners.indexOf(this), 1);
        return this;
    }

    function once() {
        var self = this, listener = self.listener;

        this.listener = function () {
            var ret = listener.apply(this, arguments);
            self.remove();
            return ret;
        }
        return this;
    }

    return function eventable$addListener(path, listener, scope, init) {
        if (listener == null) {
            warning(listener, 'trying to add a null listener %s', path)
            return;
        }
        var obj = {path, listener, scope, remove, once};

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
