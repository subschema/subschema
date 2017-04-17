"use strict";

import PropTypes from '../PropTypes';
import {resolveKey} from '../tutils';

function handleErrorsListeners(value, key, props, {valueManager}) {
    return valueManager.addErrorListener(resolveKey(props.path, value), (err, old, path)=> {
        const errors = this.injected[key] || (this.injected[key] = {});
        if (err) {
            errors[path] = err;
        } else {
            delete errors[path];
        }
        this.injected[key] = (Object.keys(errors).length > 0) ? errors : null;
        this.mounted && this.forceUpdate();
    }, this, true).remove;
}

/**
 * Listens to errors on the path and returns them.  This is similar to resolvers/error except
 * that it provides the path and all errors.
 *
 * @param Clazz
 * @param key
 */
export default function errors(Clazz, key) {
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.listener(key, handleErrorsListeners);

}