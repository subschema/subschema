"use strict";

var api = {
    /** fetch will be called when value changes **/
    fetch(url, value, component, cb) {
        value = value && value.toLowerCase();
        var data = (component.props.options || []).filter(function (v) {
            var l = ('' + v.val).toLowerCase();
            if (l.indexOf(value) > -1) {
                return true;
            }
        });

        cb(null, data);
    },
    /**Value returns the value of the object, not necessarily whats in the input box**/
    value(obj){
        return obj == null ? null : obj.val || obj;
    },
    /**
     * Format returns the format.
     * @param v
     * @returns {null}
     */
    format(v){
        return v == null ? null : v.label || v;
    }
}
export default api;