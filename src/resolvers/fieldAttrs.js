"use strict";

import {applyFuncs} from '../tutils';

export default function fieldAttrs(Clazz, key, propKeys) {

    function handleAttrs(value) {
        if (!value) return;
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

    const ClazzP = Clazz.prototype;

    ClazzP.componentWillMount = applyFuncs(function () {
        handleAttrs(this.props[key]);
    }, ClazzP.componentWillMount);

    ClazzP.componentWillReceiveProps = applyFuncs(function (newProps) {
        if (this.props[key] !== newProps[key]) {
            handleAttrs(newProps[key]);
        }
    }, ClazzP.componentWillReceiveProps);
}