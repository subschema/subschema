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
    const idx = Clazz._copyPropTypeKeys.indexOf(key);
    if (idx > -1) {
        Clazz._copyPropTypeKeys.splice(idx, 1, 'type');
    }

    Clazz::this.extendPrototype('componentWillMount', function dataType$willMount() {
        this.setState({type: this.props[key] || this.props.type});

    });

    Clazz::this.extendPrototype('componentWillReceiveProps', function dataType$willRecieveProps(newProps) {
        if (this.props[key] !== newProps[key]) {
            this.setState({type: (key in this.props) ? this.props[key] : this.props.type});
        }
    });

}
