"use strict";

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

    Clazz::this.property(key, resolve);

}