"use strict";

import {applyFuncs} from '../tutils';

function handleAttrs(value, key) {
    if (!value) return;
    if (!this.injected) this.injected = {};

    const keys = Object.keys(value);
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        if (propKeys.indexOf(key) === -1) {
            propKeys.push(key);
        }
        //This may be indeterminate, depending if something sets it later.
        this.injected[key] = value[key];
    }
}

export default function fieldAttrs(Clazz, key, propKeys) {



    const ClazzP = Clazz.prototype;

    ClazzP.componentWillMount = applyFuncs(function () {
        this::handleAttrs(this.props[key], key);
    }, ClazzP.componentWillMount);

    ClazzP.componentWillReceiveProps = applyFuncs(function (newProps) {
        if (this.props[key] !== newProps[key]) {
            this::handleAttrs(newProps[key], key);
        }
    }, ClazzP.componentWillReceiveProps);
}