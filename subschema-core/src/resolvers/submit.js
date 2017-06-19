"use strict";

import PropTypes from 'subschema-prop-types';
import { resolveKey } from 'subschema-utils';

function resolve(value, key, props, { valueManager, noValidate }) {
    const valueIsFunction = typeof value === 'function';
    if (valueIsFunction && ('defaultProps' in this.constructor)
        && value !== this.constructor.defaultProps[key]) {
        return value;
    }
    const resolvedPath = ('name' in props) ? props.name : valueIsFunction
        ? resolveKey(props.path) : resolveKey(props.path, value);
    return function targetEvent$resolve(e) {
        const value = valueManager.getValue();
        let errors;
        if (!noValidate) {
            valueManager.validate(null, value);
            errors = valueManager.getErrors();
        }
        valueManager.onSubmit(e, errors, value, resolvedPath);
    }
}
export default function submit(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;
    Clazz.contextTypes.noValidate   = PropTypes.bool;
    Clazz::this.property(key, resolve)

}
