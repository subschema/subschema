"use strict";

import PropTypes from '../PropTypes';
import {listener, resolveKey} from 'subschema-injection/src/util';
import {noop} from '../tutils';
import isPlainObject from 'lodash/lang/isPlainObject';


function handleListeners(value, key, props, context) {
    let resolvedPath;
    if (value == null || typeof value === 'string') {
        resolvedPath = resolveKey(props.path, value);
        value = settings;
    } else if (isPlainObject(value)) {
        resolvedPath = resolveKey(props.path, value.value);
        value = {...settings, ...value}
    }
    const {injected} = this;

    const listener = context.valueManager.addListener(resolvedPath, (v)=> {
        injected[key] = value.processor(v);
        this.mounted && this.forceUpdate();
    }, this, true);
    return listener.remove.bind(listener);
}

export const settings = {
    processor: function (v) {
        return v;
    }
};

export default function value(Clazz, key) {
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::listener(key, handleListeners);

}