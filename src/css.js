"use strict";

var util = require('./tutils');
function addClasses(classes, str) {
    if (str == null) {
        return;
    }
    if (util.isString(str)) {
        util.push(classes, str.split(/\s+?/));
    }
    if (util.isArray(str)) {
        str.forEach((v)=>addClasses(classes, v));
    }
    if (util.isFunction(str)) {
        addClasses(classes, str.call(this));
    }

}
var api = {
    /**
     * Determines the classes for a field.
     * Takes a react node as the first argument.
     * @param {Reactnode} node - node to create for.
     * @param {String|Function|Array<String|Function|Array>} [clases] -classes to add.
     */
    forField: function (node) {
        var classes = [];
        addClasses(classes, util.slice(arguments, 1));
        var field = node.props.field;
        var className = field && field.className || node.props.className;

        if (className) {
            addClasses(classes, className);
        } else if (node.constructor.inputClassName) {
            util.push(classes, node.constructor.inputClassName.split(/\s+?/));
        }
        return classes.join(' ');
    },
    forEditor: function (node) {
        var classes = [];
        addClasses(classes, util.slice(arguments, 1));
        var field = node.props.field;
        var className = node.props.fieldClsName || node.props.fieldClassName || node.props.fieldClass;

        if (className) {
            addClasses(classes, className);
        } else if (node.constructor.fieldClassName) {
            util.push(classes, node.constructor.inputClassName.split(/\s+?/));
        }
        if (field) {
            addClasses.call(node, classes, field.fieldClass);
            addClasses.call(node, classes, field.fieldCls);
        }
        return classes.join(' ');
    },
    addClass: function (node, className) {
        if (className) {
            if (node.classList) {
                node.classList.add(className);
            } else if (!api.hasClass(node, className)) {
                node.className = node.className + ' ' + className;
            }
        }
        return node;
    },
    hasClass: function (node, className) {
        if (node.classList) {
            return !!className && node.classList.contains(className);
        }
        return node.className.split(/\s+?/).indexOf(className) > -1;
    },
    removeClass: function (node, className) {
        if (className) {
            if (node.classList) {
                node.classList.remove(className);
            } else {
                var parts = node.className.split(/\s+?/), idx;
                while ((idx = parts.indexOf(className)) > -1) {
                    parts.splice(idx, 1)
                }
                node.className = parts.join(' ');
            }
        }
        return node;
    }
}
module.exports = api;