import PropTypes from 'subschema-prop-types';
import warning from 'subschema-utils/lib/warning';
export const defaultPropTypes = {
    id        : PropTypes.id,
    className : PropTypes.typeClass,
    onChange  : PropTypes.targetEvent,
    value     : PropTypes.value,
    fieldAttrs: PropTypes.fieldAttrs,
    name      : PropTypes.htmlFor,
    onBlur     : PropTypes.blurValidate,
    /*
     onChange    : PropTypes.targetEvent,
     onBlur      : PropTypes.blurValidate,
     onKeyDown   : PropTypes.event,
     onKeyUp     : PropTypes.event,
     onFocus     : PropTypes.event,
     onPaste     : PropTypes.event,
     value       : PropTypes.value,
     id          : PropTypes.id,
     name        : PropTypes.htmlFor,
     className   : PropTypes.typeClass,
     placeholder : PropTypes.string,
     //    autoComplete: PropTypes.string,
     //TODO -Figure out a better way - consider using intospection on DOM types.
     fieldAttrs  : PropTypes.fieldAttrs
     */
};
//Expose for configurability
export const settings         = {
    type: 'Text'
};

export function loadType(val, key, props, context) {
    let { type, propTypes, ...rest } = typeof val === 'string' ? {
        ...settings,
        type: val
    } : val == null ? settings : { ...settings, ...val };

    if (!propTypes) {
        propTypes = defaultPropTypes;
    } else {
        propTypes = { ...defaultPropTypes, ...propTypes };
    }
    let Type;
    if (typeof type === 'string') {
        Type = context.loader.loadType(type);
        warning(Type, 'Could not find a type for %s', type);

        if (!Type.displayName) {
            Type.displayName = type;
        }
    } else {
        Type = type;
    }


    const injectedClazz = context.injector.inject(Type, propTypes,
        rest.defaultProps);

    if ('template' in Type) {
        injectedClazz.template = Type.template;
    }


    return injectedClazz;
}

export default function type(Clazz, key, propList, OrigClazz) {

    Clazz.contextTypes.loader   = PropTypes.loader;
    Clazz.contextTypes.injector = PropTypes.injector;


    Clazz::this.property(key, loadType);
}
