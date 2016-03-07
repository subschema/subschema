"use strict";

import {loadValidators} from './validate';
import PropTypes from '../PropTypes';
import {noop} from '../tutils';

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


    Clazz::this.property(key, function blurValidate$prop(validate, key, props, context) {
        if (validate == null) return noop;
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
        return validate;
    });

    Clazz::this.unmount(function () {
        this._validateChangeListeners && this._validateChangeListeners();
        this._validateListener && this._validateListener();
    });
}