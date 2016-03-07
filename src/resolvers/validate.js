"use strict";

import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import {toArray, noop, resolveKey} from '../tutils';

function initValidators(nval) {
    if (typeof nval === 'function') {
        return nval;
    }
    if (typeof nval === 'string') {
        return this.loadValidator(nval)({});
    }
    return this.loadValidator(nval.type)(nval);
}

export function loadValidators(value, key, props, {loader, valueManager}) {
    const validators = toArray(value).map(initValidators, loader)
    return (...args)=> {

        const v = args.length === 0 ? valueManager.path(props.path) : args[0];
        const length = validators.length;
        let errors = null;
        for (let i = 0; i < length; i++) {
            const error = validators[i](v, valueManager);
            if (error != null) {
                if (errors == null) {
                    errors = [];
                }
                if (!Array.isArray(error)) {
                    errors.push(error);
                } else {
                    errors.push(...error);
                }
            }
        }
        valueManager.updateErrors(props.path, errors);
        return errors;
    };

}

export default function validate(Clazz, key) {
    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.property(key, loadValidators);
}