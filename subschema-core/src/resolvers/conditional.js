"use strict";

import PropTypes from 'subschema-prop-types';
import UninjectedConditional from '../Conditional';

export const settings = {
    operator   : "truthy",
    Conditional: UninjectedConditional
};
/**
 * Normalizes conditional prop,
 * @param value
 * @param key
 * @param props
 * @param injector
 * @returns {*}
 */
export function normalize(value, key, props, { injector }) {
    if (value == null || value === false || settings.Conditional === false) {
        return value;
    }
    const Conditional = injector.inject(settings.Conditional);
    const conditional = typeof value === 'string' ? {
        ...settings,
        listen : value,
        dismiss: value,
        Conditional
    } : {
        ...settings,
        Conditional,
        dismiss: value.listen,
        ...value
    };
    return conditional;
}
/**
 * Configures the configurable object.
 *
 * @param Clazz
 * @param key
 */
export default function conditional(Clazz, key) {

    Clazz.contextTypes.injector = PropTypes.injector;

    Clazz::this.property(key, normalize);
}
