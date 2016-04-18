"use strict";

import React, {Component} from "react";
import PropTypes from "../PropTypes";
import {toArray, noop} from "../tutils";
import warning from "../warning";
function initValidators(nval) {
    if (typeof nval === 'function') {
        return nval;
    }
    if (typeof nval === 'string') {
        const validator = this.loadValidator(nval);
        warning(validator, 'No validator found with name %s', nval);
        return validator({});
    }
    return this.loadValidator(nval.type)(nval);
}

export function createValidator(value, path, {loader, valueManager}) {

    const validators = toArray(value).map(initValidators, loader)
    if (validators.length === 0) {
        return null;
    }

    const validator = (...args)=> {
        let v, vm = valueManager;
        if (args.length === 2) {
            v = args[0];
            vm = args[1];
        }else{
            v = vm.path(path);
        }
        const length = validators.length;

        let errors = null;
        for (let i = 0; i < length; i++) {
            const error = validators[i](v, vm);
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
        return errors;
    };
    return validator;

}

export function loadValidators(value, key, props, context) {
    const validator = createValidator(value || props.validators, props.path, context);
    if (validator == null) {
        return noop;
    }
    return (...args)=> {
        const errors = validator(...args);
        context.valueManager.updateErrors(props.path, errors);
        return errors;
    };

}

export default function validate(Clazz, key) {
    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.property(key, loadValidators);
}