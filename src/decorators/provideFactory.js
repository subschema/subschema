"use strict";
import warning from '../warning';
import map from 'lodash/collection/map';
import decorator from './decorator';

export default function providerFactory({defaultLoader}, types = ['type', 'validator', 'template', 'processor', 'operator', 'transition']) {
    const provide = decorator(provideProperty, provideClass);
    provide.defaultLoader = defaultLoader;


    /***
     *
     * To add a type
     *
     * @provider.type("SomethingElse")
     * @field
     * class NewType extends Component {
 *
 *
 * }
     *
     *
     *
     * @param type
     * @param name
     * @param propType
     * @param loader
     * @returns {provideClass$config}
     */
    function provideClass(type, name, propType, loader = defaultLoader) {

        return function provideClass$config(target) {
            name = name || target.name;
            type = _type(type);
            loader[type](name, target);
            return target;
        }
    }

    function provideSchemaClass(name, propType, loader = defaultLoader) {

        return function provideClass$config(Target) {
            name = name || Target.name;
            loader.addSchema(name, new Target);
            return Target;
        }
    }

    function provideProperty(type, name, propType, loader = defaultLoader) {
        return function provideProperty$config(target, property, descriptor) {
            name = name || property;

            var {value, initializer, writable, configurable,  ...rest} = descriptor;
            value = value || initializer;
            loader.addLoader({
                [ _type(type, 'load')]: (loadName, ...rest)=> {
                    if (loadName === name) {
                        return value.apply(this, rest);
                    }
                },
                [ _type(type, 'list', 's')]: ()=> {
                    return {
                        name
                    }
                }
            });

            rest.set = function (newValue) {
                value = newValue;
            }

            return rest;

        }
    }

    function _type(type, prefix = 'add', postfix = '') {

        if (!type) {
            warning(false, 'must provide for a type');
            return null;
        }

        return prefix + (type.substring(0, 1).toUpperCase() + type.substring(1)) + postfix;
    }

    /**/

    types.forEach(function (key) {
        this[key] = decorator(provideProperty.bind(null, key), provideClass.bind(null, key));
    }, provide);

    provide.schema = decorator(provideClass.bind(null, 'schema'), provideSchemaClass);
    return provide;
}
/*

 export var type =  decorator(provideProperty.bind(null, 'type'), provideClass.bind(null, 'type'));
 export var validator =  decorator(provideProperty.bind(null, 'validator'), provideClass.bind(null, 'validator'));
 export var schema =  decorator(provideProperty.bind(null, 'schema'), provideClass.bind(null, 'schema'));
 export var template =  decorator(provideProperty.bind(null, 'template'), provideClass.bind(null, 'template'));
 export var processor =  decorator(provideProperty.bind(null, 'processor'), provideClass.bind(null, 'processor'));
 export var operator =  decorator(provideProperty.bind(null, 'operator'), provideClass.bind(null, 'operator'));

 */

