"use strict";

import {prop} from 'subschema-injection/src/util';
import PropTypes from '../PropTypes';
import {isString} from '../tutils';

export const settings = {};

export function loadAnimation(animation, key, props, context) {
    if (animation == null || animation === false) return null;

    if (animation === true) {
        return settings;
    }

    const {name, ...rest} = isString(animation) ? {...settings, name: animation} : {...settings, ...animation};

    if (name) {
        return context.loader.loadAnimation(name);
    }

    return rest;
}

export default function animation(Clazz, key) {

    Clazz.contextTypes.loader = PropTypes.loader;

    Clazz::prop(key, loadAnimation);

};