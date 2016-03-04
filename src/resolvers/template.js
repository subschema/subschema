"use strict";

import React, {Component} from 'react';
import {prop} from 'subschema-injection/src/util';
import PropTypes from '../PropTypes';
import {inherits, isFunction} from '../tutils';

export const settings = {
    propTypes: {
        className: PropTypes.cssClass,
        id: PropTypes.id,
        fieldClass: PropTypes.fieldClass
    }
};


export function normalize(template, _settings = settings) {

    if (template == null) {
        return _settings;
    }

    if (typeof template === 'string' || typeof template === 'function') {
        return {template}
    }
    if (template === false) {
        return {template};
    }

    if (template === true) {
        return _settings;
    }

    if (template.template === false) {
        return template;
    }
    return {
        ..._settings,
        ...template
    }
}

export function loadTemplate(value, key, props, {loader, injector}) {
    const {template, propTypes, ...rest} = normalize(value);

    if (template == null || template === false) {
        return null;
    }

    let Template;
    if (isFunction(template)) {
        Template = template;
    } else {
        Template = loader.loadTemplate(template);
        if (!Template.displayName) {
            Template.displayName = template;
        }
    }
    const InjectedTemplate = injector.inject(Template, propTypes, rest);

    return InjectedTemplate;
}

export default function template(Clazz, key) {


    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = PropTypes.injector;

    Clazz::prop(key, loadTemplate);

};