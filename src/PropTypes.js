"use strict";

import { PropTypes } from 'react';
import extend   from 'lodash/object/extend';
import find     from 'lodash/collection/find';
import map      from 'lodash/collection/map';

function customPropType(type, name) {
    function customPropType$return(...args) {
        return type.apply(api, args);
    }

    customPropType$return.isRequired = function customPropType$return$isRequired(...args) {
        return type.isRequired.apply(type, args);
    }
    if (name)
        customPropType$return.propTypeName = name;

    return customPropType$return;
}

var api = extend({}, PropTypes);
api.promise = api.shape({then: api.func});

api.id = customPropType(api.string, 'id');

api.fieldAttrs = customPropType(api.object, 'fieldAttrs');

api.cssClass = customPropType(api.string, 'cssClass');

api.event = customPropType(api.func, 'event');

api.validator = customPropType(api.func, 'validator');

api.path = customPropType(api.string, 'path');

api.placeholder = customPropType(api.string, 'placeholder');

api.arrayString = api.oneOfType([api.string, api.arrayOf(api.string)])


api.listener = customPropType(api.any, 'listener');

/**
 * A valueEvent does not expect target.value
 */
api.valueEvent = customPropType(api.func, 'valueEvent');
/**
 * A targetEvent expects the first arg to have target.value
 */
api.targetEvent = customPropType(api.func, 'targetEvent');

/**
 * Signify this is a blur Event Listener.
 */
api.blurEvent = customPropType(api.func, 'blurEvent');
/**
 * Signify this is a onValid Event listener.
 */
api.validEvent = customPropType(api.func, 'validEvent');

api.dataType = customPropType(api.string, 'dataType');

api.type = api.oneOfType([api.string, api.func]);

/**
 * Signify this property can take an expression.  This
 * allows properties to be tied to the valueManager.  So
 * it will evaluate the property against the valueManager.
 *
 * It will add a listener for each of the corresponding
 * matching strings.
 *
 */
api.expression = customPropType(api.string, 'expression');

api.loader = api.shape({
    loadTemplate: api.func,
    loadType: api.func,
    loadSchema: api.func,
    loadValidator: api.func,
    loadProcessor: api.func,
    loadOperator: api.func
});

api.valueManager = api.shape({
    addListener: api.func,

    addErrorListener: api.func,

    addValidateListener: api.func,

    addSubmitListener: api.func,

    addStateListener: api.func,
});

var contentShape = {
    className: api.cssClass,
    type: api.string,
    children: api.bool
}
var pContentShape = api.shape(contentShape);

var content = api.oneOfType([pContentShape, api.string, api.bool, api.arrayOf(api.oneOfType([api.string, pContentShape]))]);

contentShape.content = content;

api.content = content;

api.template = api.oneOfType([api.string, api.bool, api.shape({
    template: api.oneOfType([api.string, api.bool, api.func]),
    content: api.content,
    className: api.className
}), api.func]);

api.button = api.oneOfType([api.string, api.shape({
    onClick: api.event,
    buttonClass: api.cssClass,
    action: api.string,
    name: api.string,
    value: api.string,
    iconClass: api.cssClass
})]);

api.buttons = api.oneOfType([
    api.button,
    api.arrayOf(api.button),
    api.shape({
        buttonsClass: api.cssClass,
        onButtonClick: api.event,
        buttons: api.oneOfType(api.arrayString, api.arrayOf(api.button)),
        buttonTemplate: api.template,
        buttonsTemplate: api.template
    })
]);


api.fieldset = api.shape({
    fields: api.arrayString,
    legend: api.content,
    className: api.className,
    buttons: api.buttons,
    template: api.template
});
api.literal = api.oneOfType([api.string, api.bool, api.number, api.instanceOf(Date)])
api.options = api.oneOfType([
    api.arrayString,
    api.arrayOf(api.shape({
        label: api.string,
        labelHTML: api.string,
        val: api.value
    }))
]);

api.optionsGroup = api.oneOfType([
    api.arrayString,
    api.arrayOf(api.shape({
        options: api.options,
        group: api.string,
        label: api.string,
        labelHTML: api.string,
        val: api.literal
    }))
])

api.schema = api.oneOfType([api.string, api.shape({
    fields: api.arrayString,
    fieldsets: api.oneOfType([api.arrayString, api.fieldset, api.arrayOf(api.fieldset)]),
    schema: api.object,
})]);


api.validators = api.oneOfType([api.arrayString, api.arrayOf(api.validators)]);

api.operator = api.oneOfType([api.string, api.func, api.instanceOf(RegExp)]);

var events = {
    onValidate: api.event,
    onFocus: api.event,
    onBlur: api.event,
    onValid: api.event,
    onChange: api.oneOfType(api.targetEvent, api.valueEvent)
};

api.field = api.oneOfType([api.string, api.shape({
    type: api.string.isRequired,
    title: api.string,
    name: api.string,
    placeholder: api.string,
    className: api.cssClass
})]);

api.mixin = {
    events: events,
    field: extend({
        title: api.content,
        help: api.content,
        name: api.string,
        placeholder: api.placeholder,
        dataType: api.dataType,
        editorClass: api.cssClass,
        fieldClass: api.cssClass,
        field: {}
    }, events)
};

api.contextTypes = Object.freeze({
    valueManager: api.valueManager,
    loader: api.loader
});


api.processor = api.oneOfType([api.string, api.shape({
    fetch: PropTypes.func,
    value: PropTypes.func,
    format: PropTypes.func
})]);

api.propTypeToName = function propTypeToName(propType) {
    var keys = Object.keys(api), i = 0, l = keys.length, key, f;
    for (; i < l; i++) {
        key = keys[i], f = api[key];
        if (f.isRequired === propType) {
            return '*' + key;
        }
        if (f === propType) {
            return key;
        }
    }
};

api.propTypesToNames = function (props) {
    var ret = {};
    map(props, function (v, k) {
        ret[k] = api.propTypeToName(v);
    });
    return ret;
}
export default api;
