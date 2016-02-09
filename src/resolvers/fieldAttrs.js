"use strict";
import {extend} from 'subschema-injection/src/util';

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

    Clazz::extend('componentWillMount', function () {
        handleAttrs(this.props[key]);
    });
    Clazz::extend('componentWillReceiveProps', function (newProps) {
        if (this.props[key] !== newProps[key]) {
            handleAttrs(newProps[key]);
        }
    });
}