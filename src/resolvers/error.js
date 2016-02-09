"use strict";

import PropTypes from '../PropTypes';
import {listener, resolveKey} from 'subschema-injection/src/util';

function handleErrorListeners(value, key, props, context) {
    const resolvedPath = resolveKey(props.path, value);
    const {injected} = this;

    return context.valueManager.addErrorListener(resolvedPath, (err)=> {
        injected[key] = err && err[0] && err[0].message;
        this.forceUpdate();
    }, this, true).remove;
}

export default function error(Clazz, key) {
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::listener(key, handleErrorListeners);

}