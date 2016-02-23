"use strict";

import React, {Component} from 'react';
import {prop, resolveKey} from 'subschema-injection/src/util';
import PropTypes from '../PropTypes';
import {toArray, noop, FREEZE_OBJ} from '../tutils';

function initValidators(nval) {
    if (typeof nval === 'function') {
        return nval;
    }
    if (typeof nval === 'string') {
        return this.loadValidator(nval)(FREEZE_OBJ);
    }
    return this.loadValidator(nval.type)(nval);
}
function toValidators(val, loader) {
    return toArray(val).map(initValidators, loader)
}

export function loadValidators(value, key, props, context) {
    const validators = toValidators(value, context.loader);
    if (validators.length === 0) {
        return void(0);
    }
    const {valueManager} = context;

    return (...args)=> {

        const v = args.length === 0 ? valueManager.path(props.path) : args[0];
        const length = validators.length;
        const errors = [];
        for (let i = 0; i < length; i++) {
            const error = validators[i](v, valueManager);
            if (error != null) {
                errors.push(error);
            }
        }
        const hasError = errors.length === 0 ? null : errors;
        valueManager.updateErrors(props.path, hasError);
        return hasError;
    };

}

export default function validate(Clazz, key) {
    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::prop(key, loadValidators);
}