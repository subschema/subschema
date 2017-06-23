import PropTypes from 'subschema-prop-types';

export const settings = {
    //The name of the global CSS class.
    global   : 'Global',
    //What to name the css key if the value is className.
    className: 'container',
    //What pattern to pull the className key from.
    pattern  : /^(.*)[cC]lassName$/
};
function resolveStyle(value, Style = {}, loader, ret = []) {

    value = Array.isArray(value) ? value : value.split(/\s+?/);
    value.forEach(function (clz) {
        const clzStyle = Style[clz];
        if (typeof clzStyle === 'string') {
            if (ret.indexOf(clzStyle) === -1) {
                ret.push(clzStyle);
                return;
            }
        }

        const parts = clz.split('.', 2);
        if (parts.length === 2) {
            return resolveStyle(parts[1], loader.loadStyle(parts[0]), loader,
                ret);
        } else if (parts.length == 1) {
            if (parts[0] in Style) {
                const val = Style[parts[0]];
                if (val == null || ret.indexOf(val) == -1) {
                    return ret.push(val);
                } else {
                    return;
                }
            }
            const Global = loader.loadStyle(settings.global);
            //once we get here we can go no further.
            if (!(Global === Style)) {
                return resolveStyle(parts[0], Global, loader, ret);

            } else if (ret.indexOf(parts[0]) == -1) {
                ret.push(parts[0])
            }
        }

    });
    if (!ret || ret.length == 0) {
        return;
    }
    if (ret.length == 1) {
        return ret[0];
    }
    return ret.join(' ');
}
/**
 * className resolver attempts to resolve the provided className against
 * the current className, or the global, finally returning what was given.
 *
 * @param Clazz
 * @param key
 * @param propList
 * @param OrigClazz
 */
export default function className(Clazz, key, propList, OrigClazz) {
    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz::this.property(key,
        function style$resolver(value, key, props, { loader }) {
            if (value == null) {
                value =
                    key.replace(settings.pattern, '$1') || settings.className;
            } else if (!(typeof value == 'string' || Array.isArray(value))) {
                return value;
            }
            const Style = loadStyle(OrigClazz, loader);
            if (Style) {
                value = resolveStyle(value, Style, loader);
            }
            if (Array.isArray(value)) {
                value = value.join(' ');
            }

            return value;

        });
}
function loadStyle(OrigClazz, loader) {
    let Style = OrigClazz.displayName ? loader.loadStyle(OrigClazz.displayName)
        : loader.loadStyle(OrigClazz.name);
    if (!Style) {
        return loader.loadStyle(settings.global);
    }
    return Style;
}
