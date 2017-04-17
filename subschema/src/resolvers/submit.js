"use strict";

import PropTypes from "../PropTypes";
import {resolveKey} from "../tutils";

function resolve(value, key, props, {valueManager, noValidate}) {
    if (typeof value === 'function') {
        return value;
    }
    const resolvedPath = props.name || resolveKey(props.path, value);
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
    Clazz.contextTypes.noValidate = PropTypes.bool;
    Clazz::this.property(key, resolve)

}