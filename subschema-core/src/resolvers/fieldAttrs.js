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

        if (value[key] != null || key in this.state) {
            //This may be indeterminate, depending if something sets it later.
            if (this.mounted) {
                this.setState(value);
            } else {
                this.state[key] = value[key];
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
