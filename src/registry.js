var Registry = function (opts) {
    if (!(this instanceof Registry)) {
        return new Registry(opts);
    }
    var beans = {};

    function _register(type, value, obj) {
        var parts = type.split('/', 2), key = parts[0], rest = parts[1];
        if (parts.length === 1) {
            if (key[obj] == null) {
                key[obj] = [value];
            } else {
                key[obj].unshift(value);
            }
        } else {
            _register(rest, value, (obj[key] || (obj[key] = {})));
        }
    }
    function when(field, fn){

    }
    function register(type, value) {
        _register(type, value, beans);
    }

    function resolve(type, field, def) {
        var parts = type.split('/');

    }
}


module.exports = Registry;