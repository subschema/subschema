"use strict";

import React, {Component} from 'react';
import {prop, extend, unmount, removeListeners, resolveKey} from 'subschema-injection/src/util';
import {toArray, noop, FREEZE_OBJ} from '../tutils';
import {loadValidators} from './validate';
import PropTypes from '../PropTypes';

export default function blurValidate(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;
    Clazz.contextTypes.loader = PropTypes.loader;


    Clazz::prop(key, function blurValidate$prop(validate, key, props, context) {
        if (validate == null) return void(0);
        validate = typeof validate === 'function' ? validate : this::loadValidators(validate, key, props, context);

        const {path} = props;

        let hasChanged = false, hasBlurred = false;

        this._validateListener = context.valueManager.addValidateListener(path, ()=>validate()).remove;


        this._validateChangeListeners = context.valueManager.addListener(path, (val)=> {
            //fires onChange so its true.
            hasChanged = true;
            //at some point it has blurred
            if (hasBlurred) {
                validate(val);
            }
        }, this, false).remove;

        //blur event if its changed we will validate.
        return this::function handleBlur(e) {
            hasBlurred = true;
            if (hasChanged) {
                validate();
            }
        }

    });

    Clazz::unmount(function () {
        this._validateChangeListeners && this._validateChangeListeners();
        this._validateListener && this._validateListener();
    });
}