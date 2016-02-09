"use strict";

import PropTypes from '../PropTypes';
import {listener, resolveKey} from 'subschema-injection/src/util';

function handleListeners(value, key, props, context) {
    const resolvedPath = resolveKey(props.path, value);
    const {injected} = this;
    return context.valueManager.addListener(resolvedPath, (v)=> {
        injected[key] = v;
        this.forceUpdate();
    }, null, true).remove;
}

export default function value(Clazz, key) {
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::listener(key, handleListeners);

}