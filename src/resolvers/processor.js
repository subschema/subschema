"use strict";

import {prop} from 'subschema-injection/src/util';

function loadProcessor(value, key, props, {loader}){
    return loader.loadProcessor(value);
}

export default function processor(Clazz, key){
    Clazz::prop(key, loadProcessor);
}
