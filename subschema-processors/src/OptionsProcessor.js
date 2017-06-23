const lc = (v) => {
    if (!v) {
        return;
    }
    return ('' + v).toLowerCase();
};

const lccontains = (v1, v2) => {
    if (!(v1 && v2)) {
        return false;
    }
    const r = lc(v2).indexOf(v1) > -1;
    return r;
};
const EMPTY      = [];

const api = {
    /** fetch will be called when value changes **/
    fetch(url, value, component, cb) {
        value = lc(value);
        if (!value) {
            return cb(null, EMPTY);
        }
        const data = (component.props.options || []).filter(function (v) {
            return lccontains(value, v.label) || lccontains(value, v.val);

        });

        cb(null, data);
    },
    /**Value returns the value of the object, not necessarily whats in the input box**/
    value(obj){
        return obj == null ? null : obj.val == null ? obj : obj.val;
    },
    /**
     * Format returns the format.
     * @param v
     * @returns {null}
     */
    format(v){
        return v == null ? null : v.label == null ? v : v.label;
    }
};
export default api;
