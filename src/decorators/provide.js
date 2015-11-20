"use strict";
import warning from '../warning';
import map from 'lodash/collection/map';
import decorator from './decorator';
import loader from '../loader';

function provideClass(type, name, propType, loader = loader) {

    return function provideClass$config(target) {
        if (!type) {
            warning(false, 'must provide for %s', target && target.name);
            return target;
        }
        name = name || target.name;
        type = 'add' + (type.substring(0, 1).toUpperCase() + type.substring(1));
        loader[type](name, target);
        return target;
    }
}
function provideProperty(type, name, propType, loader = loader){
    return function provideProperty$config(template, property, descriptor){
        var {value, writable, configurable,  ...rest} = descriptor;
        type = 'add' + (type.substring(0, 1).toUpperCase() + type.substring(1));
        rest.set = function(value){
            loader[type](property, value);
        }

        rest.get = function(){

            return function rest$get(...args){
                var ret = value.apply(this, args);
                loader[type](property, ret);
                return ret;
            }
        }
        return rest;

    }
}
var provide = decorator(provideProperty, provideClass);

['type', 'validator', 'schema', 'template', 'processor'].forEach(function (key) {
    this[key] = decorator(provideProperty.bind(null, key), provideClass.bind(null, key));
}, provide);

export default provide;
