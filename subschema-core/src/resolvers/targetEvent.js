"use strict";

import PropTypes from 'subschema-prop-types';
import { resolveKey } from 'subschema-utils';

function resolve(value, key, props, { valueManager }) {
    const valueIsFunction = typeof value === 'function';
    if (valueIsFunction && ('defaultProps' in this.constructor)
        && value !== this.constructor.defaultProps[key]) {
        return value;
    }
    const resolvedPath = valueIsFunction ? resolveKey(props.path) : resolveKey(
        props.path, value);
    return function targetEvent$resolve(e) {
        valueManager.update(resolvedPath, e.target.value)
    }
}
export default function targetEvent(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.property(key, resolve)

}
