"use strict";
import decorator from './decorator';
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
function listen(type = DEFAULT_TYPE, path = DEFAULT_PATH, init = DEFAULT_INIT) {
    return function listen$decorate(Target, name, description) {
        wrapTargetWithContextTypes(Target, function listen$config$init(addResult) {
            addResult(type, path, description.value, init);
        });
        return description;
    }
}

export default decorator.property(listen);
