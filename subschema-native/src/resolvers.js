import PropTypes from 'subschema-prop-types';
import {warning} from 'subschema-utils';


export function onSubmitEditing(Clazz, key) {
    Clazz::this.property(key, function onSubmit$endingBlur(value, key, props) {
        console.log('not sure', value, key, props);
        return function () {
            console.log('called');

        }
    });
}
export const settings = {
    style: {
        global: 'Global',
        postFix: 'Class',
        preFix: '',
        attribute: 'style'
    }
};
function addClass(obj, key, value) {
    if (value == null) return;
    const cvalue = obj[key];
    if (cvalue != null) {
        if (Array.isArray(cvalue)) {
            obj[key] = cvalue.concat(value);
        } else {
            if (Array.isArray(value)) {
                obj[key] = [cvalue, ...value];
            } else {
                obj[key] = [cvalue, value];
            }
        }
    } else {
        if (Array.isArray(value)) {
            if (value.length > 0) {
                if (value.length == 1) {
                    obj[key] = value[0];
                } else {
                    obj[key] = value;
                }
            }
        } else {
            obj[key] = value;
        }
    }
}
/**
 * Takes the keys of a style object and converts them to an object
 * suitable to default props with the default value being the styles
 * resolved default style.
 *
 * If a style returns a string
 *
 * @param styles
 * @param props
 * @param preFix
 * @param postFix
 * @returns {*}
 */
export function styleToProps(styles, props = {}, loader, preFix = settings.style.preFix, postFix = settings.style.postFix) {
    if (styles == null) return;
    if (typeof styles === 'string') {
        styles = {[settings.style.attribute]: styles};
    }
    if (!styles) return;
    return Object.keys(styles).reduce((ret, key) => {
        const value = styles[key];
        const fullKey = `${preFix}${key}${postFix}`;

        if (typeof value === 'string') {
            const classes = value.split(/\s+?/).map(function (path) {
                let parts = path.split('.', 2);
                if (parts.length === 1) {
                    parts.unshift(settings.style.global);
                }
                const Style = loader.loadStyle(parts[0]);
                return Style && Style[parts[1]];
            }).filter(Boolean);
            addClass(ret, key, classes);

        } else {
            addClass(ret, fullKey, value);
        }
        return ret
    }, props);
}
/**
 * So styles tries toload via loader.loadStyle(ClassName or the value of the style) which
 * should return an object.
 *
 * It will iterate over said object and properties with the key being renamed ${key}Class
 * and the value being installed.
 *
 * If a value is passed to the object, for a field, than that value is used.  Rather
 * than the
 *
 *
 * @param Clazz
 * @param key
 * @param propList
 * @param OrigClazz
 */

export function style(Clazz, key, propList, OrigClazz) {
    Clazz.contextTypes.loader = PropTypes.loader;

    Clazz::this.property(key, function style$resolver$property(value, key, props, {loader}) {
        const state = {};
        let Style = value == null || typeof value === 'string' ? loader.loadStyle(value || OrigClazz.displayName || OrigClazz.name) : value;


        const obj = styleToProps(Style, {}, loader);
        obj && Object.keys(obj).forEach((key) => {
            if (key in props) {
                state[key] = props[key];
            } else {
                state[key] = obj[key];
            }
            if (propList.indexOf(key) === -1) {
                propList.push(key);
            }
        });
        if (this.mounted) {
            this.setState(state);
        } else {
            Object.assign(this.state, state);
        }

        return Style;
    });
}
function resolveStyle(value, Style, loader, ret = []) {
    value = Array.isArray(value) ? value : value.split(/\s+?/);
    value.forEach(function (clz) {
        if (typeof clz === 'number') return clz;
        if (typeof Style[clz] === 'string')
            return resolveStyle(Style[clz], Style, loader, ret);

        const parts = clz.split('.', 2);
        if (parts.length === 2) {
            return resolveStyle(parts[1], loader.loadStyle(parts[0]), loader, ret);
        } else if (parts.length == 1) {
            if (parts[0] in Style) {
                const val = Style[parts[0]];
                if (val == null || ret.indexOf(val) == -1)
                    return ret.push(Style[parts[0]]);
                else
                    return;
            }
            const Global = loader.loadStyle(settings.style.global);
            //once we get here we can go no further.
            if (!(Global === Style))
                return resolveStyle(parts[0], Global, loader, ret);
        }

    });
    if (!ret || ret.length == 0) return;
    if (ret.length == 1) return ret[0];
    return ret;
}

export function styleClass(Clazz, key, propList, OrigClazz) {
    const postReplaceRe = new RegExp(`${settings.style.postFix}$`);
    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz::this.property(key, function style$resolver$property(value, key, props, {loader}) {
        if (value != null && !(typeof value == 'string' || Array.isArray(value))) return value;
        let Style = loadStyle(OrigClazz, loader);
        if (!Style) {
            return;
        }
        const resolvedStyle = resolveStyle(value || key.replace(postReplaceRe, ''), Style, loader)
        const state = {[key]: resolvedStyle};
        if (this.mounted) {
            this.setState(state);
        } else {
            Object.assign(this.state, state);
        }

        return resolvedStyle;
    });
}
function loadStyle(OrigClazz, loader) {
    let Style = OrigClazz.displayName ? loader.loadStyle(OrigClazz.displayName) : loader.loadStyle(OrigClazz.name);
    if (!Style) {
        return loader.loadStyle(settings.style.global);
    }
    return Style;
}


export default ({style, styleClass, onSubmitEditing});