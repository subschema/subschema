"use strict";

import PropTypes from '../PropTypes';
import {resolveKey} from '../tutils';
import isPlainObject from 'lodash/isPlainObject';

function createHandler(value, key, loader){
    if (value.processor){
        const process = typeof value.processor == 'function' ? value.processor: loader.loadProcessor(value.processor).value;
        return function value$processsorHandler(v){
            this.injected[key] = process(v);
            this.mounted && this.forceUpdate();
        };
    }
    return function value$handler(v){
        this.injected[key] = v == null ? '' : v;
        this.mounted && this.forceUpdate();
    };
}

export function handleListeners(value, key, props, {valueManager, loader}) {
    let resolvedPath;
    if (value == null || typeof value === 'string') {
        resolvedPath = resolveKey(props.path, value);
        value = settings;
    } else if (isPlainObject(value)) {
        resolvedPath = resolveKey(props.path, value.value);
        value = {...settings, ...value}
    }

    return valueManager.addListener(resolvedPath, createHandler(value, key, loader), this, value.init).remove;
}

export const settings = {
    //fire the listener immediately, do not wait for a change.
    init: true
};

export default function value(Clazz, key) {
    Clazz.contextTypes.valueManager = PropTypes.valueManager;
    Clazz.contextTypes.loader = PropTypes.loader;

    Clazz::this.listener(key, handleListeners);

}