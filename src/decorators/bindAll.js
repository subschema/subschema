"use strict";
import decorator from './decorator';

function match(name, include) {
    if (include) {
        //name = addStuff
        //include = add
        return (include.test) ? include.test(name) : (name.indexOf(include) > -1);
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
/**
 * Bind methods to a class. 
 *  Include will include only those matching.
 *  Exclude will exclude only those that match.
 * Otherwise binds all.
 *@param {Array.[string|RegExp]} names - Include the names
 *@param {Array.[string|RegExp]} include - Include the names matching (regexp or substring)
 *@param {Array.[string|RegExp]} exclude - Exclude the names matching (regexp or substring)
*/
function bindAll(names = [], include = [], exclude = []) {
    return function bindAll$decorator(Target) {
        //prevent a method from being bound twice. (ie. a regex that matches include and does not match exclude)
        var TP = Target.prototype;
        class BindAllTarget extends Target {
            constructor(args) {
                super(...args);
                var bound = [];
                names = names == null || names.length === 0 ? Object.getOwnPropertyNames(TP) : names;
                for (var i = 0, l = names.length; i < l; i++) {
                    var prop = names[i];
                    if (prop !== 'constructor' && typeof TP[prop] === 'function' && allow(prop, include, exclude)) {
                        var ofunc = TP[prop];
                        if (bound.indexOf(ofunc) === -1) {
                            bound.push(ofunc);
                            this[prop] = ofunc.bind(this);
                        }
                    }
                }
                bound = null;
            }
        }

        return BindAllTarget;
    }
}
export default decorator(null, bindAll);
