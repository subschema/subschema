"use strict";

import PropTypes from "../PropTypes";
import {noop, resolveKey} from "../tutils";

function resolve(value, key, props, context) {
    if (typeof value === 'function') {
        return value;
    }
    const resolvedPath = resolveKey(props.path, value);
    if (props.path == null && resolvedPath == null) {
        return noop;
    }
    return function (v, overridePath) {
        context.valueManager.update(overridePath || resolvedPath, v);
    }
}

export default function valueEvent(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.property(key, resolve);

}