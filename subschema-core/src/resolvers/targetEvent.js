"use strict";

import PropTypes from '../PropTypes';
import { resolveKey } from '../tutils';

function resolve(value, key, props, {valueManager}) {
    if (typeof value === 'function') {
        return value;
    }
    const resolvedPath = resolveKey(props.path, value);
    return function targetEvent$resolve(e) {
        valueManager.update(resolvedPath, e.target.value)
    }
}
export default function targetEvent(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.property(key, resolve)

}