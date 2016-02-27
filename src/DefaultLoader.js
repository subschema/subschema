"use strict";
import loaderFactory from './loaderFactory';
import templates from './templates';
import types from './types';
import processors from './processors';
import validators from './validators';
import styles from './styles';

const loader = loaderFactory();

loader.addTemplate(templates);
loader.addProcessor(processors);
loader.addType(Object.keys(types).reduce((ret, key)=> {
    if (/^(index|.*Mixin)$/.test(key)) {
        return ret;
    }
    ret[key] = types[key];
    return ret;
}, {}));
loader.addStyle(styles);
loader.addValidator(validators);

export default loader;
