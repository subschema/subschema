"use strict";
import {prop} from 'subschema-injection/src/util';

/**
 * Returns the injected class as a property to the child class.
 * Useful for Content.
 *
 * @param Clazz
 * @param key
 */
export default function injected(Clazz, key) {

    Clazz::prop(key, function () {
        return Clazz;
    });
}