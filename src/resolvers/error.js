"use strict";

import PropTypes from '../PropTypes';
import {resolveKey} from '../tutils';

function handleErrorListeners(value, key, props, {valueManager}) {
    const resolvedPath = resolveKey(props.path, value);
    return valueManager.addErrorListener(resolvedPath, (err)=> {
        this.injected[key] = err && err[0] && err[0].message;
        this.mounted && this.forceUpdate();
    }, this, true).remove;
}

export default function error(Clazz, key) {
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.listener(key, handleErrorListeners);

}