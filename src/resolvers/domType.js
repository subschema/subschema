"use strict";
import React from 'react';
import PropTypes from '../PropTypes';
import {prop} from 'subschema-injection/src/util';
import {FREEZE_OBJ} from '../tutils';

const DOM = React.DOM || FREEZE_OBJ;

//Expose for configurability
export const settings = {
    type: 'span'
};

export function loadType(val, key, props, context) {

    const {type, ...rest} = typeof val === 'string' ? {
        ...settings,
        type: val
    } : val == null ? settings : {...settings, ...val};

    if (DOM[type]) {
        return type;
    }

    const Type = context.loader.loadType(type);

    const injectedClazz = context.injector.inject(Type, null, rest);
    return injectedClazz;
}

export default function type(Clazz, key, propList, OrigClazz) {

    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = PropTypes.injector;


    Clazz::prop(key, loadType);
}
