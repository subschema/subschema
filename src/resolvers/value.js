"use strict";

import PropTypes from '../PropTypes';
import {listener, resolveKey} from 'subschema-injection/src/util';
import isPlainObject from 'lodash/lang/isPlainObject';

export function handleListeners(value, key, props, {valueManager}) {
    let resolvedPath;
    if (value == null || typeof value === 'string') {
        resolvedPath = resolveKey(props.path, value);
        value = settings;
    } else if (isPlainObject(value)) {
        resolvedPath = resolveKey(props.path, value.value);
        value = {...settings, ...value}
    }


    return valueManager.addListener(resolvedPath, (v)=> {
        this.injected[key] = value.processor(v);
        this.mounted && this.forceUpdate();
    }, this, value.init).remove;
}

export const settings = {
    processor: function (v) {
        return v;
    },
    //fire the listener immediately, do not wait for a change.
    init: true
};

export default function value(Clazz, key) {
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.listener(key, handleListeners);

}