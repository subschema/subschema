"use strict";

import { PropTypes } from 'react';
import extend   from 'lodash/object/extend';
import find     from 'lodash/collection/find';
import map      from 'lodash/collection/map';

var api = extend({}, PropTypes);
api.cssClass = function api$cssClass() {
    return api.string.apply(api, arguments);
};

api.cssClass.isRequired = function api$cssClass$isRequired() {
    return api.string.isRequired.apply(api.string, arguments);
}

api.event = function api$event() {
    return api.func.apply(api.func, arguments);
};

api.event.isRequired = function api$event$isRequired() {
    return api.func.isRequired.apply(api.func, arguments);
}

var arrayString = api.oneOfType([api.string, api.arrayOf(api.string)])
api.arrayString = function api$arrayString() {
    return arrayString.apply(api, arguments);
};

api.arrayString.isRequired = function api$arrayString$isRequired() {
    return arrayString.isRequired.apply(arrayString, arguments);
}


api.path = function api$path() {
    return api.string.apply(api, arguments);
}
api.path.isRequired = function ap$path$isRequired() {
    return api.string.isRequired.apply(api.string, arguments);
}

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
    removeListener: api.func,

    addErrorListener: api.func,
    removeErrorListener: api.func,

    addValidateListener: api.func,
    removeValidateListener: api.func,

    addSubmitListener: api.func,
    removeSubmitListener: api.func,

    addStateListener: api.func,
    removeStateListener: api.func
});

api.content = api.oneOfType([api.string, api.shape({
    content: api.string,
    className: api.cssClass,
    type: api.string,
    children: api.bool
})]);


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


api.template = api.oneOfType([api.string, api.shape({
    template: api.oneOfType([api.string, api.bool]),
    content: api.content,
    className: api.className

})]);

api.type = api.oneOfType([api.string, api.object])


var events = {
    onValidate: api.event,
    onFocus: api.event,
    onBlur: api.event,
    onValid: api.event,
    onChange: api.event
};

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
    valueManager:api.valueManager,
    loader:api.loader
});

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
