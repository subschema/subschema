"use strict";

/**
 * Returns the injected class as a property to the child class.
 * Useful for Content.
 *
 * @param Clazz
 * @param key
 */
export default function injected(Clazz, key) {

    Clazz::this.property(key, function () {
        return Clazz;
    });
}