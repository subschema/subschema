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
    const idx = propTypeKeys.indexOf(key);
    if (idx > -1){
       propTypeKeys.splice(idx, 1, 'type');
    }

    Clazz::this.extendPrototype('componentWillMount', function dataType$willMount() {
        if (!this.injected) this.injected = {};
        this.injected.type = this.props[key] || this.props.type;
    });

    Clazz::this.extendPrototype('componentWillReceiveProps', function dataType$willRecieveProps(newProps) {
        if (!this.injected) this.injected = {};
        if (this.props[key] !== newProps[key]) {
            this.injected.type = this.props[key] || this.props.type;
        }
    });

}
