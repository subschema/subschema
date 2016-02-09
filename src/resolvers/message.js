"use strict";
import {prop} from 'subschema-injection/src/util';

export default function message(Clazz, key) {

    Clazz:prop(key, function (value) {
        if (value == null || value.length == 0) return null;
        const message = value.length && value.length > 0 ? value[0] : value;
        if (!message) {
            return null;
        }
        return message.message || message;
    });
}