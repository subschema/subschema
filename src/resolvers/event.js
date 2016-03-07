"use strict";

import {noop} from '../tutils';

function handleEvent(value) {
    if (value == null) return noop;
    return value;
}

export default function event(Clazz, key) {
    Clazz::this.property(key, handleEvent);
}