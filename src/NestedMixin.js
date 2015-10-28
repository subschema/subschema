"use strict";
var React = require('./react');
var tu = require('./tutils');
var toArray = tu.toArray;
var Editor = require('./Editor');
var ValueManager = require('./ValueManager');
var LoaderMixin = require('./LoaderMixin');
var warning = require("fbjs/lib/warning");
var map = require('lodash/collection/map');
var push = Function.apply.bind(Array.prototype.push);
var noTypeInfo;
if ("production" !== process.env.NODE_ENV) {
    noTypeInfo = function (f) {
        ("production" !== process.env.NODE_ENV ? warning(
            false,
            'subschema: tried to instatiate a field without any type info probable a typo %s', f) : null);
    };
} else {
    noTypeInfo = function () {
    }
}

function normalizeFieldsets(fieldsets, fields) {
    if (!(fieldsets || fields)) return {};
    fields = toArray(fields);
    //fields trump fieldsets
    //otherwise recurse
    fieldsets = toArray(fieldsets).map((f)=> {
        if (f.fields) {
            var {...rest} = f;
            rest.fields = toArray(rest.fields);
            fields.push.apply(fields, rest.fields);
            return rest;
        } else if (f.fieldsets) {
            var {fieldsets, ...rest} = f;
            rest.fieldsets = normalizeFieldsets(fieldsets, fields).fieldsets;
            return rest;
        } else if (tu.isString(f) || tu.isArray(f)) {
            var processFields = toArray(f);
            push(fields, processFields);
            return {
                fields: processFields
            }
        } else if (f.fieldsets) {
            var {fieldsets, ...rest} = f;
            rest.fieldsets = normalizeFieldsets(fieldsets, fields).fieldsets;
            return rest;
        } else {
            console.log('do not know what %s this is ', fieldset);
        }
    });
    if (fieldsets.length === 0) {
        fieldsets = [{fields: fields}];
    }
    return {
        fieldsets,
        fields
    }
}

function normalizeSchema(oschema, loader, fs, f) {
    if (oschema == null) {
        return {};
    }

    if (tu.isString(oschema)) {
        var loaded = loader.loadSchema(oschema);
        return normalizeSchema(loaded, loader);
    } else if (tu.isString(oschema.schema)) {

        var schema = loader.loadSchema(oschema.schema);
        return normalizeSchema(schema, loader);
    } else if (oschema.subSchema) {
        var {subSchema, ...rest} = oschema;
        rest.schema = subSchema;
        return normalizeSchema(rest, loader);
    }
    if (!oschema.schema) {
        return normalizeSchema({
            schema: oschema
        }, loader);
    }
    var {fields, fieldsets, ...schema} = oschema;
    if (fs) {
        fieldsets = fs;
    }
    if (f) {
        fields = f;
    }
    if (!(fieldsets || fields)) {
        fields = Object.keys(schema.schema);
    }
    var {fieldsets, fields} = normalizeFieldsets(fieldsets, fields);
    schema.fieldsets = fieldsets;
    schema.fields = fields;
    return schema;
}

var NestedMixin = {
    mixins: [LoaderMixin],
    getDefaultProps() {
        return {
            path: null,

            schema: {},
            valueManager: ValueManager()
        }

    },
    componentWillMount(){
        this.updateProps({}, this.props);
    },
    componentWillReceiveProps(newProps){
        this.updateProps(this.props, newProps);
    },

    updateProps(oldProps, newProps){
        var field = newProps.field || newProps;
        this.schema = normalizeSchema(field.subSchema || field.schema, newProps.loader, field.fields, field.fieldsets);
        console.log('schema', JSON.stringify(this.schema, null, '\t'));
        if (oldProps.value !== newProps.value) {
            newProps.valueManager.setValue(newProps.value);
        }
    },

    makeFieldset(f, i){
        var Template = this.template(f.template || 'FieldSetTemplate');
        return <Template key={'f' + i} field={f} legend={f.legend}
                         loader={this.props.loader}
                         onButtonClick={this.props.onButtonClick}
                         fields={f.fields}
                         schema={this.schema.schema}
                         valueManager={this.props.valueManager}>
            {f.fields ? this.makeFields(f.fields) : map(f.fieldsets, this.makeFieldset)}
        </Template>
    },


    getValue()
    {
        return this.props.valueManager.path(this.props.path);
    }
    ,
    addEditor(field, f)
    {
        if (field == null) {
            return null;
        }
        return <Editor ref={f} key={'key-' + f} path={tu.path(this.props.path, f)}
                       field={field}
                       loader={this.props.loader}
                       name={f}
                       template={field.template}
                       valueManager={this.props.valueManager}/>
    }
    ,
    makeFields(fields)
    {
        var fieldMap = {}, schema = this.schema.schema;

        fields = toArray(fields).map((field) => {
            var [f, rest] = field.split('.', 2);
            if (rest) {
                (fieldMap[f] || (fieldMap[f] = [])).push(rest);
            }
            return f;
        });


        return tu.unique(fields).map((f, i) => {
            f = tu.isString(f) ? f : f && f.name || 'field-' + i;
            var ref = tu.isString(f) ? tu.clone(schema[f]) : f, mappedFields = fieldMap[f];
            if (tu.isString(ref)) {
                ref = {
                    type: ref
                }
            } else {
                if (ref == null) {
                    noTypeInfo(f);
                    return null;
                }
                if (!ref.type) {
                    ref.type = 'Text';
                }
            }
            if (mappedFields || ref.fields || ref.fieldsets) {
                var {fieldsets, fields, ...rest} = ref;
                rest.fieldsets = normalizeFieldsets(fieldsets, fields || mappedFields);
                ref = rest;
            }
            return this.addEditor(ref, f);
        });
    },

    renderSchema()
    {
        return map(this.schema.fieldsets, this.makeFieldset);
    },

    render()
    {

        var {schema, subSchema, title, fields, submitButton,  template, ...props} = this.props;

        var Template = this.template(schema.template || template);
        return <Template ref="form" onValidate={this.handleValidate} schema={this.schema}
                         className={this.props.className}
                         title={title === false ?'' : title}

            {...props}
                         onSubmit={this.handleSubmit || this.props.onSubmit}
                         loader={this.props.loader}
                         valueManager={this.props.valueManager}
            >
            {this.schema && this.schema.schema ? this.renderSchema() : null}

            {this.props.children}
        </Template>
    }

}
NestedMixin.normalizeSchema = normalizeSchema;
NestedMixin.normalizeFieldsets = normalizeFieldsets;
module.exports = NestedMixin;
