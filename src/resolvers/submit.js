"use strict";

import PropTypes from "../PropTypes";
import {resolveKey} from "../tutils";

function resolve(value, key, props, {valueManager}) {
    if (typeof value === 'function') {
        return value;
    }
    const resolvedPath = resolveKey(props.path, value);
    return function targetEvent$resolve(e) {
        const value = valueManager.getValue();
        valueManager.validate(null, value);

        valueManager.onSubmit(e, valueManager.getErrors(), value, resolvedPath);
    }
}
export default function submit(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.property(key, resolve)

}