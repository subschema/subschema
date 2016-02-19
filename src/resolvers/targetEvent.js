"use strict";

import PropTypes from '../PropTypes';
import { resolveKey, prop} from 'subschema-injection/src/util';

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

    Clazz::prop(key, resolve)

}