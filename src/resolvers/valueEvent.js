"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import {prop, resolveKey} from 'subschema-injection/src/util';

function resolve(value, key, props, context) {
    const resolvedPath = resolveKey(path, value);
    return (v) => context.valueManager.update(resolvedPath, v);
}

export default function valueEvent(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::prop(key, resolve);

}