"use strict";
import warning from '../warning';
import map from 'lodash/collection/map';

 function provide(type) {
    function provide$config(typeName) {

/*
        return function provide$decorator(target, name, descriptor) {
            if (target && name && descriptor){

            }
            if (!name,)
        }*/
    }

}
export function type() {
    return provide.bind(null, ['type'].concat(arguments));
}
export function validator() {
    return provide.bind(null, ['validator'].concat(arguments));
}
export function template() {
    return provide.bind(null, ['template'].concat(arguments));
}
export function schema() {
    return provide.bind(null, ['schema'].concat(arguments));
}
export function processor() {
    return provide.apply(null, ['processor'].concat(arguments));
}

export default provide;