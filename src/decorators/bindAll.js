"use strict";

function match(name, include) {
    if (include) {
        return (include.test) ? include.test(name) : (include === name);
    }
}

function allow(name, includes, excludes) {
    var il = includes ? includes.length : 0, el = excludes ? excludes.length : 0, i = 0;
    if (il === 0 && el === 0) {
        return true;
    }

    for (i = 0; i < il; i++) {
        if (match(name, includes[i])) {
            return true;
        }
    }

    if (el === 0 && il > 0) return false;

    for (i = 0; i < el; i++) {
        if (match(name, excludes[i])) {
            return false;
        }
    }
    return true;
}

export default function bindAll(include, exclude) {

    if (Array.isArray(include) || Array.isArray(exclude)) {
        return bindAll$config(include, exclude);
    }

    return bindAll$config()(include);

    function bindAll$config(include = [], exclude = []) {
        return function bindAll$decorator(Target) {

            class BindTarget extends Target {
                static displayName = Target.name;

                constructor() {
                    super(...arguments);
                    var names = Object.getOwnPropertyNames(Target.prototype);
                    for (var i = 0, l = names.length; i < l; i++) {
                        var prop = names[i];
                        if (prop !== 'constructor' && typeof this[prop] === 'function' && allow(prop, include, exclude)) {
                            this[prop] = this[prop].bind(this);
                        }
                    }
                }
            }
            return BindTarget;
        }
    }
}