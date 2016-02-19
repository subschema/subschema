"use strict";

import { prop} from 'subschema-injection/src/util';
import {noop} from '../tutils';
function handleEvent(value) {
    if (value == null) return noop;
    return value;
}
export default function event(Clazz, key) {

    Clazz::prop(key, handleEvent);
}