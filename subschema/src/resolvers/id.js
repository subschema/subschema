"use strict";

function idValue(value, key, props) {
    if (value == null) return props.path;
    return value;
}
export default function id(Clazz, key) {

    Clazz::this.property(key, idValue);
}