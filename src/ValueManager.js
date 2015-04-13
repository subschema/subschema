var tu = require('./tutils');
function ValueManager(value) {
    this.listeners = [];
    this.value = value;
}
function canDescend(obj) {
    if (obj == null || tu.isNumber(obj) || tu.isBoolean(obj) || tu.isString(obj) || tu.isDate(obj) || tu.isArray(obj)) {
        return false;
    }
    return true;
}
ValueManager.prototype = {
    addListener(path, listener){
        var obj = {path, listener};
        this.listeners.push(obj);
        return obj;
    },
    removeListener(path, listener){
        var remove = this.listeners.concat();
        if (path && !listener && !tu.isString(path)) {
            path = listener;
            listener = null;
        }
        if (path) {
            remove = remove.filter((v)=> {
                return v.path === path;
            });
        }
        if (listener) {
            remove = remove.filter(v=> {
                return v.listener === listener;
            });
        }
        return remove.map(function (r) {
            var idx = this.indexOf(r);
            if (idx > -1) {
                return this.splice(idx, 1)[0];
            }
        }, this.listeners);
    },
    removeAll(){
        this.listeners.length = 0;
    },

    onValueChange(path, value, oldValue){
        var parts = path && path.split('.') || [];
        var pp;
        var obj = this.value, oobj = this.oldValue;
        for (let i = 0, l = parts.length; i < l; i++) {
            var key = parts[i];
            pp = tu.path(pp, key);
            if (this.listeners.some((v)=> {
                    if (v.path == null || v.path === pp) {
                        return (v.listener(value, oldValue, path) === false);
                    }
                }) === true) {
                return false
            }
        }
    },
    update(path, value){
        var parts = path.split('.'), obj = this.value;

        for (let i = 0, l = parts.length - 1; i < l; i++) {
            let key = parts[i];
            if (key in obj) {
                obj = obj[key];
            } else {
                if (/^\d+?$/.test(parts[i + 1])) {
                    obj = obj[key] = [];
                } else {
                    obj = obj[key] = {};
                }
            }
        }
        var last = parts[parts.length - 1];
        var oldValue = canDescend(obj[last]) ? tu.extend({},obj[last]) : obj[last];
        obj[last] = value;
        return this.onValueChange(path, value, oldValue) !== false;
    },
    setValue(value){
        this.oldValue = this.value;
        this.value = value;
        if (this._setValue(value, this.oldValue) !== false) {

        }
    },
    getValue(){
        return this.value;
    },
    _setValue(value, oldValue, path){
        if (canDescend(value) || canDescend(oldValue)) {
            var keys = tu.unique([].concat(value ? Object.keys(value) : [], oldValue ? Object.keys(oldValue) : []));
            keys.forEach(function (key) {
                this._setValue(value && value[key], oldValue && oldValue[key], tu.path(path, key));
            }, this);
        } else {
            return this.onValueChange(path, value, oldValue);
        }

    }
}

module.exports = ValueManager;