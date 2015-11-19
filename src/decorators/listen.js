"use strict";

import {wrapTargetWithContextTypes} from '../listenUtil';

/**
 * This is a decorator that listens for events and fires them
 *
 *
 *
 * @param {MapTypes} [type=value] type - The type of listener to add.
 * @param {string} path - The path to listener if empty then the name of the property is used as the path.
 * @param {boolean} [init=true] - Init the function on componentWillMount.
 * @returns {ListenDecorator}
 */
const DEFAULT_TYPE = 'value';
const DEFAULT_PATH = '.';
const DEFAULT_INIT = true;
export default function listen(type = DEFAULT_TYPE, path = DEFAULT_PATH, init = DEFAULT_INIT) {
    if (typeof type !== 'string') {
        return listen$config(DEFAULT_TYPE, DEFAULT_PATH, DEFAULT_INIT)(arguments[0], arguments[1], arguments[2]);
    } else {
        return listen$config(type, path, init);
    }

    function listen$config(type, path, init) {
        return function listen$decorate(Target, name, description) {
             wrapTargetWithContextTypes(Target, function listen$config$init(addResult) {
                addResult(type, path, description.value, init);
            });
            return description;
        }
    }

}
