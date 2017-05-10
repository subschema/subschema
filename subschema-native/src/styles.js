import {StyleSheet} from 'react-native';

const styleContext = require.context("./styles", true, /\.js$/);

const Styles = styleContext.keys().reduce(function (ret, key) {
    const style = styleContext(key);
    ret[key.replace(/(?:.+?\/)?(.+?)\.js$/, '$1')] = style.default || style;
    return ret;
}, {});

Styles.Password = Styles.Text;

function compile(styles) {

    const compiledStyles = {};
    Object.keys(styles).forEach(function (key) {
        const current = styles[key];
        const currentString = {};

        compiledStyles[key] = StyleSheet.create(Object.keys(current).filter(function (skey) {
            if (typeof current[skey] == 'string') {
                currentString[skey] = current[skey];
                return false;
            }
            return true;
        }).reduce(function (style, skey) {
            style[skey] = current[skey];
            return style;
        }, {}));
        Object.assign(current, currentString);
    });
    return compiledStyles;
}

export default compile(Styles);