import {prop} from 'subschema-injection/src/util';
import PropTypes from '../PropTypes';
import {isString} from '../tutils';

function idValue(value, key, props) {
    if (value == null) return props.path;
    return value;
}
export default function id(Clazz, key) {

    Clazz::prop(key, idValue);
}