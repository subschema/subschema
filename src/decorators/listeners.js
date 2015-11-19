"use strict";

import {wrapTargetWithContextTypes, removeListener} from '../listenUtil';
import warning from '../warning';
import decorator from './decorator';
import map from 'lodash/collection/map';


/**
 * Take an object or result of function.  The key is what to listen to,
 * and the key is the path to listen to and the right side is the method to listen to.
 *
 * Use it to add listeners from an object or a function call.
 *
 * @param {MapTypes} type - A string enum that describes the type of listener.
 * @param {bool} init - Weather to call the function on attach.
 * @returns {ListenersDecorator}
 */
function listeners(type = 'value', init = true) {
    return function listeners$config(Target, name, description) {
        var {value, initializer} = description;
        wrapTargetWithContextTypes(Target, function (addResult) {
            var scope = this,
                //Items will only be used in case the method is a function
                items;

            if (typeof value === 'function') {

                //If the method is invoked again, readd the listeners.
                //invoke it the first time to get the listeners.
                items = addListeners(value.call(this));
                description.value = valueWrapper;

            } else if (value) {
                addListeners(value);
            } else if (initializer) {
                addListeners(initializer());
            } else {
                warning(false, 'Property does not have an initializer or value "%s"', name);
                return;
            }


            /**
             * This does the heavy lifting.
             * @param values
             */
            function addListeners(values) {
                //track what items where added form this function in case
                // we need to unlisten later.
                return map(values, function (method, path) {
                    var _init = init;
                    //If it is is an array of func, bool use the bool as the init method.
                    //This is for legacy support.
                    if (Array.isArray(method)) {
                        _init = method[1];
                        method = method[0];
                    }
                    return addResult(type, path, method, _init == null ? init : _init);
                });
            }

            function valueWrapper() {

                // but if no listeners than it will be empty
                if (items != null) {
                    //scope for the listeners will may not be this, but we don't
                    // want to leak.
                    items.forEach(removeListener.bind(null, scope.__listeners));
                }
                //scope to the current invocation not necessarily the component.
                var ret = value.apply(this, arguments);
                items = addListeners(ret);
                return ret;
            }
        });
        return description;
    }
}
export default decorator(listeners)