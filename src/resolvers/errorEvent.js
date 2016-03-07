"use strict";

import {resolveKey} from '../tutils';
import PropTypes from '../PropTypes';

function errorUpdate(value, key, props, context) {
    const resolvedKey = resolveKey(props.path, value);
    return (val)=> context.valueManager.updateErrors(resolvedKey, val);
}

export default function errorEvent(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.property(errorUpdate);

}