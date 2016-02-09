"use strict";
import {prop} from 'subschema-injection/src/util';
import {addClasses} from './typeClass';


export function forTemplate(OrigClazz, ...classes) {
    return addClasses(classes, OrigClazz.fieldClassName).join(' ');
}

export default function templateClass(Clazz, key, propList, OrigClazz) {
    if (propList.indexOf('className') == -1) {
        propList.push('className');
    }

    Clazz::prop(key, function (value, k, props) {
        return forTemplate(OrigClazz, props.fieldClass, props.fieldCls);
    });

}