import {prop} from 'subschema-injection/src/util';
import PropTypes from '../PropTypes';
import {isString} from '../tutils';

function injectClass(value, key, props, context) {
    if (value == null) return;
    if (typeof value === 'function') {
        return context.injector.inject(value);
    }
    if (Array.isArray(value)) {
        return context.injector.inject(...value);
    }
    if (value.target) {
        const {target, propTypes, propValues, strict}  = value;
        return context.injector.inject(target, propTypes, propValues, strict);
    }
    return value;
}

export default function id(Clazz, key) {

    Clazz.contextTypes.injector = PropTypes.injector;

    Clazz::prop(key, injectClass);
}