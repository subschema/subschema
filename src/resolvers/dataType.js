"use strict";

/**
 * Convert the dataType property to the type property.  Only
 * useful for making schema conversions easier, and avoid conflicts with
 * type types.
 *
 * @param Clazz
 * @param props
 * @param key
 * @param value
 */
export default function dataType(Clazz, key, propTypeKeys) {

    //array of keys to allow for prop type renames.  This should not happen much, but we have dataType->type conversion.
    propTypeKeys.splice(propTypeKeys.indexOf(key), 1, 'type');


    Clazz::this.extendPrototype('componentWillMount', function dataType$willMount() {
        this.injected.type = this.props[key];
    });

    Clazz::this.extendPrototype('componentWillReceiveProps', function dataType$willRecieveProps(newProps) {
        if (this.props[key] !== newProps[key]) {
            this.injected.type = this.props[key];
        }
    });

}