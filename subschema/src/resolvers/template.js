"use strict";

import PropTypes from '../PropTypes';
import {inherits, isFunction, FREEZE_OBJ} from '../tutils';
import warning from '../warning';

export const settings = {
    propTypes: {
        className: PropTypes.cssClass,
        id: PropTypes.id,
        htmlFor: PropTypes.htmlFor
        // fieldClass: PropTypes.fieldClass
    }
};


export function loadTemplateRecursive(current, next = {}, context) {
    if (current === false) {
        return false;
    }
    if (current == null) {
        return null;
    }
    if (typeof current === 'string') {
        const Template = context.loader.loadTemplate(current);
        if (!Template) {
            warning(Template, 'Template for name "%s" is not defined', current);
            return null;
        }
        if (typeof Template === 'function') {
            if (!Template.displayName) {
                Template.displayName = current;
            }
        }
        return loadTemplateRecursive(Template, next, context);

    } else if (typeof current === 'function') {
        const {propTypes, defaultProps, template, ...restNext} = next;

        return {
            ...restNext,
            Template: context.injector.inject(current, propTypes, defaultProps)
        }
    } else if ('template' in current) {
        return loadTemplateRecursive(current.template, {...next, ...current}, context);
    }

    return {
        ...next,
        ...current
    };
}

export function loadTemplate(value, key, props, context) {
    return loadTemplateRecursive(value, settings, context);
}

export default function resolve$template(Clazz, key) {


    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = PropTypes.injector;

    Clazz::this.property(key, loadTemplate);

};