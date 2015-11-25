"use strict";

import warning from '../warning';
import {FREEZE_ARR} from '../tutils';

function isDescriptor(obj) {
    if (typeof obj !== 'object') return false;
    var keys = Object.keys(obj);
    if (keys.indexOf('enumerable') === -1) return false;
    if (keys.indexOf('configurable') === -1) return false;
    if (keys.indexOf('writable') === -1) return false;
    return true;
}
function emptyClassConfig() {
    return function emptyClass$return(Target) {
        return Target;
    }
}
function emptyPropertyConfig() {
    return function emptyProp$return(target, name, descriptor) {
        return descriptor;
    }
}
/**
 * Check if Method decorator.
 * Returns true if it is a property decorator.
 * issues warning if it is a property decorator used on a class.
 */
function isProperty(config, args) {
    //3 arguments
    if (args == null || args.length != 3 || args[0] == null || args[1] == null || args[2] == null) {
        return false;
    }

    //First argument is an object with a function constructor.
    //TODO find better isntance detection.
    if (!(typeof args[0] === 'object' && typeof args[0].constructor === 'function')) {
        return false;
    }

    //Second argument is a string
    if (!(typeof args[1] === 'string')) {
        return false;
    }

    //Third argument is the descriptors argument.
    if (!isDescriptor(args[2])) {
        return false;
        //return Object.hasOwnPropty(args[2], 'value');
    }
    if (config == null) {
        decorator.warning(false, 'decorator [%s]#[%s] was used on a method, but the decorator does not support this', ...args)
        return false;
    }
    return true;
}

/**
 * Check if Class decorator
 * Returns true if it is a class decorator.
 * Issues warning if it is a class decorator used on a property and return true.
 * return false otherwise.
 *
 * //BUG-
 * If someone uses a function as the only parameter to a property descriptor, this will fail.
 * as we can not determine if this is being invoked
 * Example
 * var a = function(){}
 * @decorator(a);
 * class Stuff {
 * 
 * }
 *
 *
 */
function isClass(config, args) {

    if (args != null && args.length === 1 && typeof args[0] === 'function') {
        if (config == null) {
            decorator.warning(false, 'decorator [%s] was used on a class, but the decorator does not support this', ...args)
            return false;
        }
        return true;
    }
    return false;
}
/**
 * Check if the decorator is a property or a class decorator and invoke accordingly
 */
function decorator$config$config(propertyConfig, classConfig, decoratorArgs = [], ...args) {
    if (isProperty(propertyConfig, args)) {


        return propertyConfig(...decoratorArgs)(...args);
    }
    if (isClass(classConfig, args)) {

        return classConfig(...decoratorArgs)(...args);
    }
    return false;
}

/**
 * config returns a function that is the decorator.
 * This should normalize decorator access.
 * The first argument to the decorator is 'method' if it is a method decorator, or 'class' if it is
 * a class decorator.
 *
 * It also numeralizes invoked, vs uninvoked decorators
 * @decorator
 * class Stuf {
 * }
 * or
 * @decorator()
 * class Stuf {
 * }
 *
 * can be handled without any other checks.
 *
 * Note this follows the @decorators() protocol.   So the method decorated, should always return
 * a method.   Regardless of typical usage.
 *
 * You can also specify different functions for class decoration or property decoration.
 *
 */
function decorator(propertyConfig = null, classConfig = null) {
    var decorator$config = function decorator$config(...decoratorArgs) {
        if (decorator$config.noDecorate || decorator.noDecorate) {
            propertyConfig = emptyPropertyConfig;
            classConfig = emptyClassConfig;
        }
        return decorator$config$config(propertyConfig, classConfig, FREEZE_ARR, ...decoratorArgs) || decorator$config$config.bind(null, propertyConfig, classConfig, decoratorArgs)
    }
    return decorator$config;
}
decorator.property = decorator.bind(null);
decorator.clazz = decorator.bind(null, null);
decorator.warning = warning;

//Disable decoration - useful for testing.
decorator.noDecorate = false;

export default decorator;
