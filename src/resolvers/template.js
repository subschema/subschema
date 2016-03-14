"use strict";

import PropTypes from '../PropTypes';
import {inherits, isFunction, FREEZE_OBJ} from '../tutils';
import warning from '../warning';

export const settings = {
    propTypes: {
        className: PropTypes.cssClass,
        id: PropTypes.id,
        htmlFor:PropTypes.htmlFor
       // fieldClass: PropTypes.fieldClass
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
    } else if (template === false) {
        return FREEZE_OBJ;
    } else {
        Template = loader.loadTemplate(template);
        warning(Template, 'Template for name "%s" is not defined', template);
        if (!Template.displayName) {
            Template.displayName = template;
        }
    }

    const InjectedTemplate = injector.inject(Template, propTypes);

    return {Template: InjectedTemplate, ...rest};
}

export default function template(Clazz, key) {


    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = PropTypes.injector;

    Clazz::this.property(key, loadTemplate);

};