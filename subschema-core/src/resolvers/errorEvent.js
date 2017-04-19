"use strict";

import {resolveKey} from "subschema-utils";
import PropTypes from "subschema-prop-types";

function errorUpdate(value, key, props, {valueManager}) {
    const resolvedKey = resolveKey(props.path, value);
    return val => valueManager.updateErrors(resolvedKey, val);
}

export default function errorEvent(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.property(key, errorUpdate);

}
