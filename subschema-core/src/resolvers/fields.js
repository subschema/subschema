"use strict";

import {toArray} from '../tutils';

export function normalizeFields(fields) {
    if (fields == null) {
        return fields;
    }
    fields = toArray(fields);
    if (fields.length === 0) {
        return null;
    }
    return fields;
}
export default function fields(Clazz, key) {
    Clazz::this.property(key, normalizeFields);
}