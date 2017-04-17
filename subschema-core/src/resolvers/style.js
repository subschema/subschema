"use strict";
import PropTypes from '../PropTypes';


/**
 * Takes the keys of a style object and converts them to an object
 * suitable to default props with the default value being the styles
 * resolved default style.
 *
 * @param styles
 * @param props
 * @param preFix
 * @param postFix
 * @returns {*}
 */
export function styleToProps(styles, props = {}, preFix = '', postFix = "Class") {
    return Object.keys(styles).reduce((ret, key) => {
        ret[`${preFix}${key}${postFix}`] = styles[key];
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
export default function style(Clazz, key, propList, OrigClazz) {
    Clazz.contextTypes.loader = PropTypes.loader;

    Clazz::this.property(key, function style$resolver$property(value, key, props, {loader}) {
        const {injected} = this;
        const Style = value == null || typeof value === 'string' ? loader.loadStyle(value || OrigClazz.displayName || OrigClazz.name) : value;
        if (Style == null) {
            return Style;
        }
        const obj = styleToProps(Style, {});
        Object.keys(obj).forEach((key)=> {
            if (key in props) {
                injected[key] = props[key] || '';
            } else {
                injected[key] = obj[key];
            }
            if (propList.indexOf(key) === -1) {
                propList.push(key);
            }
        });
        return Style;
    });
}