"use strict";

import React, {Component} from 'react';
import {prop, extend, unmount, removeListeners, resolveKey} from 'subschema-injection/src/util';
import {toArray, noop, FREEZE_OBJ} from '../tutils';
import {loadValidators} from './validate';
import PropTypes from '../PropTypes';

/**
 * Validates on change, used in checkbox.  As it needs validation without blur.  In cases like text,
 * the behaviour is different.
 *
 * @param Clazz
 * @param key
 */
export default function changeValidate(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;
    Clazz.contextTypes.loader = PropTypes.loader;


    Clazz::prop(key, function blurValidate$prop(validate, key, props, context) {
        if (validate == null) return void(0);
        validate = typeof validate === 'function' ? validate : this::loadValidators(validate, key, props, context);

        const {path} = props;

        this._validateListener = context.valueManager.addValidateListener(path, () => {
                return validate()
            }
        ).remove;

        this._validateChangeListeners = context.valueManager.addListener(path, (val)=> {
            validate(val);
        }, this, false).remove;

        //blur event if its changed we will validate.
        return this::function handleChange(e) {
            validate();
        }

    });

    Clazz::unmount(function () {
        this._validateChangeListeners && this._validateChangeListeners();
        this._validateListener && this._validateListener();
    });
}