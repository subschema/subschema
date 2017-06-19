"use strict";

import PropTypes from 'subschema-prop-types';
import { noop, resolveKey } from 'subschema-utils';

function resolve(value, key, props, context) {
    const valueIsFunction = typeof value === 'function';
    if (valueIsFunction && ('defaultProps' in this.constructor)
        && value !== this.constructor.defaultProps[key]) {
        return value;
    }
    const resolvedPath = valueIsFunction ? resolveKey(props.path) : resolveKey(
        props.path, value);
    if (resolvedPath == null) {
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
