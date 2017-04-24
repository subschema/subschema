import React from 'react';
import {applyFuncs} from "subschema-utils";

function handleAttrs(value, attr, propKeys) {
    if (!value) return;


    const keys = Object.keys(value);
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        if (propKeys.indexOf(key) === -1) {
            propKeys.push(key);
        }

        if (value[key] != null || this.injected && this.injected[key] != null) {
            if (!this.injected) this.injected = {};
            //This may be indeterminate, depending if something sets it later.
            if (this.injected)
                Object.assign(this.injected, value);
            else {
                Object.assign(this.injected = {}, value);
            }
        }
    }
}
function remove(all, key) {
    var idx;
    if ((idx = all.indexOf(key)) != -1) {
        all.splice(idx, 1);
        return all;
    }
    return all;
}
export default function fieldAttrs(Clazz, key, propKeys) {

    //keeps the property from leaking to the wrapped class.
    remove(Clazz._copyPropTypeKeys, key);

    const ClazzP = Clazz.prototype;

    ClazzP.componentWillMount = applyFuncs(function () {
        this::handleAttrs(this.props[key], key, propKeys);
    }, ClazzP.componentWillMount);

    ClazzP.componentWillReceiveProps = applyFuncs(function (newProps) {
        if (this.props[key] !== newProps[key]) {
            this::handleAttrs(newProps[key], key);
        }
    }, ClazzP.componentWillReceiveProps);


}
