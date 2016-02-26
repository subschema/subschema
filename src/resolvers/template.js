"use strict";

import React, {Component} from 'react';
import {prop} from 'subschema-injection/src/util';
import PropTypes from '../PropTypes';
import {inherits, isFunction} from '../tutils';

const propTypes = {
    className: PropTypes.cssClass,
    id: PropTypes.id,
    fieldClass: PropTypes.fieldClass
};


export function normalize(template, settings = {}) {

    if (template == null) {
        return settings;
    }

    if (typeof template === 'string' || typeof template === 'function') {
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
    return {
        ...settings,
        ...template
    }
}

export function loadTemplate(value, key, props, context) {
    const {template, ...rest} = normalize(value);

    if (template == null || template === false) {
        return null;
    }

    const Template = isFunction(template) ? template : context.loader.loadTemplate(template);

    const InjectedTemplate =  context.injector.inject(Template, propTypes, rest);

    return InjectedTemplate;
}

export default function template(Clazz, key) {


    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = PropTypes.injector;

    Clazz::prop(key, loadTemplate);

};