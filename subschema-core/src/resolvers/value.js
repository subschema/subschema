"use strict";

import PropTypes from 'subschema-prop-types';
import {resolveKey} from 'subschema-utils';
import isPlainObject from 'lodash/isPlainObject';

function createHandler(value, key, loader) {
    if (value.processor) {
        const process = typeof value.processor == 'function' ? value.processor : loader.loadProcessor(value.processor).value;
        return function value$processsorHandler(v) {
            if (this.mounted) {
                this.setState({[key]: process(v)})
            } else {
                this.state[key] = process(v);
            }
        };
    }
    return function value$handler(v) {
        if (this.mounted) {
            this.setState({[key]: v == null ? '' : v})
        } else {
            this.state[key] = v == null ? '' : v;
        }
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
