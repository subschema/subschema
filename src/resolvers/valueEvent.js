"use strict";

import PropTypes from '../PropTypes';
import {prop, resolveKey} from 'subschema-injection/src/util';

function resolve(value, key, props, context) {
    if (typeof value === 'function') {
        return value;
    }
    const resolvedPath = resolveKey(props.path, value);
    return function (v) {
        context.valueManager.update(resolvedPath, v);
    }
}

export default function valueEvent(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::prop(key, resolve);

}