"use strict";

import React from 'react';
import PropTypes from '../PropTypes';
import {FREEZE_OBJ} from '../tutils';

const DOM = React.DOM || FREEZE_OBJ;

//Expose for configurability
export const settings = {
    type: 'span'
};

export function loadType(val, key, props, {loader, injector}) {

    const {type, ...rest} = typeof val === 'string' ? {
        ...settings,
        type: val
    } : val == null ? settings : {...settings, ...val};

    if (DOM[type]) {
        return type;
    }

    const Type = loader.loadType(type);

    const injectedClazz = injector.inject(Type, null, rest);
    return injectedClazz;
}

export default function type(Clazz, key, propList, OrigClazz) {

    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = PropTypes.injector;


    Clazz::this.property(key, loadType);
}
