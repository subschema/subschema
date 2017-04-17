"use strict";

function loadProcessor(value, key, props, {loader}){
    return loader.loadProcessor(value);
}

export default function processor(Clazz, key){
    Clazz::this.property(key, loadProcessor);
}
