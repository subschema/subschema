"use strict";

import React, {Component} from 'react';
import {prop} from 'subschema-injection/src/util';
import PropTypes from '../PropTypes';

const propTypes = {
    className: PropTypes.cssClass,
    id: PropTypes.id
};


export function normalize(template, settings = {}) {

    if (template == null) {
        return settings;
    }

    if (typeof template === 'string') {
        return {template}
    }
    if (template === false) {
        return {template};
    }

    if (template === true) {
        return settings;
    }

    if (template.template === false) {
        return template;
    }
    if (!template.template) {
        if (settings == null) {
            return template;
        }
        return {
            ...template,
            ...settings
        }
    }

    return template;
}

export function loadTemplate(value, key, props, context) {
    const {template, ...rest} = normalize(value);
    if (template === false) {
        return null;
    }

    const Template = context.loader.loadTemplate(template);

    return context.injector.inject(Template, propTypes, rest);
}

export default function template(Clazz, key) {


    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = PropTypes.injector;

    Clazz::prop(key, loadTemplate);

};