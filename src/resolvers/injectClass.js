import {prop} from 'subschema-injection/src/util';
import PropTypes from '../PropTypes';
import {isString} from '../tutils';

export function resolve(clz, loader) {
    if (typeof clz === 'string') {
        return loader.loadTemplate(clz);
    }
    return clz;
}

export function injectClass(value, key, props, {injector,loader}) {
    if (value == null) return;
    if (Array.isArray(value)) {
        const [clz, ...rest] = value;
        return injector.inject(resolve(clz, loader), ...rest);
    }
    if (value.target) {
        const {target, propTypes, propValues, strict}  = value;
        return injector.inject(resolve(target, loader), propTypes, propValues, strict);
    }
    return injector.inject(resolve(value, loader));

}

export default function id(Clazz, key) {

    Clazz.contextTypes.injector = PropTypes.injector;
    Clazz.contextTypes.loader = PropTypes.loader;

    Clazz::prop(key, injectClass);
}