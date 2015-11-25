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

api.cssClass = customPropType(api.string, 'cssClass');

api.event = customPropType(api.func, 'event');

api.validator = customPropType(api.func, 'validator');

api.path = customPropType(api.string, 'path');

api.arrayString = api.oneOfType([api.string, api.arrayOf(api.string)])


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
        buttonTemplate: api.template
    })
]);


api.fieldset = api.shape({
    fields: api.arrayString,
    legend: api.content,
    className: api.className,
    buttons: api.buttons,
    template: api.template
});
api.literal = api.oneOf(api.string, api.bool, api.number, api.instanceOf(Date))
api.options = api.oneOfType([
    api.arrayString,
    api.arrayOf(api.shape({
        label: api.string,
        labelHTML: api.string,
        val: api.value
    }))
]);
api.type = api.oneOfType([api.string, api.func]);

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


api.type = api.oneOfType([api.string, api.object])

api.validators = api.arrayOf(api.validators);

api.operator = api.oneOfType([api.string, api.func]);

var events = {
    onValidate: api.event,
    onFocus: api.event,
    onBlur: api.event,
    onValid: api.event,
    onChange: api.event
};
api.field = api.oneOfType([api.string, api.shape({
    type: api.string.isRequired,
    title: api.string,
    name: api.string,
    placeholder: api.string,
    className: api.cssClass
})])
api.mixin = {
    events: events,
    field: extend({
        title: api.content,
        help: api.content,
        name: api.string,
        placeholder: api.string,
        dataType: api.string,
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
api.promise = api.shape({then: api.func});
api.propTypesToNames = function (props) {
    var ret = {};
    map(props, function (v, k) {
        ret[k] = api.propTypeToName(v);
    });
    return ret;
}
export default api;
