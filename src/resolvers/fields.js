"use strict";

import {prop} from 'subschema-injection/src/util';
import {toArray} from '../tutils';


export default function fields(Clazz, key) {
    Clazz::prop(key, toArray);
}