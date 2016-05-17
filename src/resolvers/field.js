"use strict";

import PropTypes from '../PropTypes';
import {FREEZE_OBJ} from '../tutils';
import {loadTemplate} from './template';
import {loadType} from './type';
import Conditional from '../components/Conditional';
import warning from '../warning';

export const settings = {
    type: 'Text',
    template: 'EditorTemplate'
};

function toTemplate(template) {
    const tType = typeof template;
    if (template === false || tType === 'string' || tType === 'function') {
        return {
            template
        }
    }
    return template;
}

export default function field(Clazz, key, propList) {

    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = PropTypes.injector;
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::this.property(key, function field$prop(value, key, props, context, OrigClazz) {
            const normal = {}
            if (value == null) {
                value = FREEZE_OBJ;
            } else if (typeof value === 'string') {
                value = {type: value}
            } else {

                if (value.conditional) {
                    if (value.conditional === 'string') {
                        normal.conditional = {operator: value.conditional}
                    }
                }
            }
            const Type = loadType(value.type || settings.type, null, null, context);
            warning(Type, 'No Type found for %s at path "%s"', value.type, props.path);

            const template = Object.assign({}, toTemplate(settings.template), toTemplate(Type.template), toTemplate(value.template));

            const ret = {
                ...settings,
                ...value,
                ...normal,
                template:loadTemplate(template, key, props, context),
                Type
            };
            delete ret.type;
            return ret;
        }
    );


}
