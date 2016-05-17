"use strict";

import PropTypes from '../PropTypes';
import UninjectedConditional from '../components/Conditional';

export const settings = {
    operator: "truthy",
    Conditional: UninjectedConditional
};

export function normalize(value, key, props, {injector}) {
    if (value == null || value === false) {
        return value;
    }
    const Conditional = injector.inject(settings.Conditional);
    const conditional = typeof value === 'string' ? {...settings, Conditional, operator: value} : {
        ...settings,
        Conditional,
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
