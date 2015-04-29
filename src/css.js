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
module.exports = {
    /**
     * Determines the classes for a field.
     * Takes a react node as the first argument.
     * @param {ReactElement} node - node to create for.
     * @param {String|Function|Array<String|Function|Array>} [clases] -classes to add.
     */
    forField: function (node) {
        var classes = [];
        addClasses(classes, util.slice(arguments, 1));
        var field = node.props.field;
        if (node.constructor.inputClassName) {
            util.push(classes, node.constructor.inputClassName.split(/\s+?/));
        }
        if (field) {
            addClasses.call(node, classes, field.fieldClass);
            addClasses.call(node, classes, field.fieldCls);
        }
        return classes.join(' ');
    }
}