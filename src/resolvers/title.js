"use strict";

import {prop} from 'subschema-injection/src/util';
import {titlelize } from '../tutils';

function resolve(value, key, props) {
    if (value === false) {
        return '';
    }
    if (value) {
        return value;
    }
    const val = props.name || props.id || props.path || '';

    return titlelize(val.split(/\./).pop());
}

export default function valueEvent(Clazz, key) {

    Clazz::prop(key, resolve);

}