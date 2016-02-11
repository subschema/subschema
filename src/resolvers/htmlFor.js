import {prop} from 'subschema-injection/src/util';

function idValue(value, key, props) {
    if (value == null) return props.id || props.path;
    return value;
}
export default function htmlFor(Clazz, key) {

    Clazz::prop(key, idValue);
}