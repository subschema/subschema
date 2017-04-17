"use strict";

import {push, toArray,isString} from '../tutils';

export function normalizeFieldsets(fieldsets, fields) {
    if (!(fieldsets || fields)) return {};
    fields = toArray(fields);
    //fields trump fieldsets
    //otherwise recurse
    fieldsets = toArray(fieldsets).map((f)=> {
        if (f.fields) {
            var {...rest} = f;
            rest.fields = toArray(rest.fields);
            push(fields, rest.fields);
            return rest;
        } else if (f.fieldsets) {
            var {fieldsets, ...rest} = f;
            rest.fieldsets = normalizeFieldsets(fieldsets, fields).fieldsets;

            return rest;
        } else if (isString(f) || Array.isArray(f)) {
            var processFields = toArray(f);
            push(fields, processFields);
            return {
                fields: processFields
            }
        } else if (f.fieldsets) {
            var {fieldsets, ...rest} = f;
            rest.fieldsets = normalizeFieldsets(fieldsets, fields).fieldsets;
            return rest;
        } else {
            return f;
//            warning(false, 'do not know what %s this is ', f);
        }
    });
    if (fieldsets.length === 0) {
        fieldsets = [{fields: fields}];
    }
    return {
        fieldsets,
        fields
    }
}
function normal(value) {
    return normalizeFieldsets(value, []);
}
function fieldsets(Clazz, key) {
    Clazz::this.property(key, normal);
}
fieldsets.normalizeFieldsets = normalizeFieldsets;
export default fieldsets;
