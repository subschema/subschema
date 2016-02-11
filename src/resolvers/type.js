"use strict";

import PropTypes from '../PropTypes';
import {prop} from 'subschema-injection/src/util';

const propTypes = {
    onChange: PropTypes.targetEvent,
    onBlur: PropTypes.blurValidate,
    value: PropTypes.value,
    id: PropTypes.id,
    name: PropTypes.name,
    className: PropTypes.typeClass,
    placeholder: PropTypes.string
};

//Expose for configurability
export const settings = {
    type: 'Text'
};

export function loadType(val, key, props, context) {
    const {type, ...rest} = typeof val === 'string' ? {
        ...settings,
        type: val
    } : val == null ? settings : {...settings, ...val};

    const Type = context.loader.loadType(type);

    const injectedClazz = context.injector.inject(Type, propTypes, rest);

    if ('template' in Type) {
        injectedClazz.template = Type.template;
    }

    return injectedClazz;
}

export default function type(Clazz, key, propList, OrigClazz) {

    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = PropTypes.injector;


    Clazz::prop(key, loadType);
}
