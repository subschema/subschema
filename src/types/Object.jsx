"use strict";
import React, {Component}  from 'react';
import PropTypes  from '../PropTypes';
import {toArray, isString, isArray, unique, path, clone, noop}  from '../tutils';
import Editor  from '../components/Editor';
import ValueManager  from '../ValueManager';
import map  from 'lodash/collection/map';
import Template  from '../components/Template.jsx';

var push = Function.apply.bind(Array.prototype.push);

var noTypeInfo;
if ("production" !== process.env.NODE_ENV) {
    noTypeInfo = function (f) {
        ("production" !== process.env.NODE_ENV ? console.log(
            false,
            'subschema: tried to create a field  "%s"  without any type info likely a typo', f) : null);
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
        } else if (isString(f) || isArray(f)) {
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

    if (isString(oschema)) {
        return normalizeSchema(loader.loadSchema(oschema), loader, fs, f);
    } else if (isString(oschema.schema)) {
        return normalizeSchema(loader.loadSchema(oschema.schema), loader, fs, f);
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

export default class ObjectType extends Component {

    static defaultProps = {
        path: null,
        template: 'ObjectTemplate',
        schema: {},
        onButtonClick: noop
    }

    static normalizeSchema = normalizeSchema;

    static normalizeFieldsets = normalizeFieldsets;

    static contextTypes = PropTypes.contextTypes;


    componentWillMount() {
        this.updateProps({}, this.props);
    }

    componentWillReceiveProps(newProps) {
        this.updateProps(this.props, newProps);
    }

    updateProps(oldProps, newProps) {
        var field = newProps.field || newProps;
        this.schema = normalizeSchema(field.subSchema || field.schema, this.context.loader, field.fields, field.fieldsets);
        if (oldProps.value !== newProps.value) {
            this.context.valueManager.setValue(newProps.value);
        }
    }

    makeFieldset = (f, i)=> {
        return <Template template={f.template || 'FieldSetTemplate'} key={'f' + i} field={f} legend={f.legend}
                         onButtonClick={this.props.onButtonClick}
                         onSubmit={this.props.onSubmit}
                         fields={f.fields}
                         schema={this.schema.schema}>
            {f.fields ? this.makeFields(f.fields) : map(f.fieldsets, this.makeFieldset)}
        </Template>
    }

    getValue() {
        return this.state.value;
    }

    addEditor(field, f) {
        if (field == null) {
            return null;
        }
        return <Editor ref={f} key={'key-' + f} path={path(this.props.path, f)}
                       field={field}
                       name={f}
                       template={field.template}
        />
    }

    makeFields(fields) {
        var fieldMap = {}, schema = this.schema.schema;

        fields = toArray(fields).map((field) => {
            var [f, rest] = field.split('.', 2);
            if (rest) {
                (fieldMap[f] || (fieldMap[f] = [])).push(rest);
            }
            return f;
        });


        return unique(fields).map((f, i) => {
            f = isString(f) ? f : f && f.name || 'field-' + i;
            var ref = isString(f) ? clone(schema[f]) : f, mappedFields = fieldMap[f];
            if (isString(ref)) {
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
    }

    renderSchema() {
        return map(this.schema.fieldsets, this.makeFieldset);
    }

    render() {
        //capture the things that should not fall through.
        var {schema, subSchema, title, fields, submitButton, conditional, template, ...props} = this.props;
        return <Template ref="form" template={schema.template || template} onValidate={this.handleValidate}
                         schema={this.schema}
                         className={this.props.className}
                         title={title === false ?'' : title}
            {...props}
                         onSubmit={this.handleSubmit || this.props.onSubmit}
        >
            {this.schema && this.schema.schema ? this.renderSchema() : null}

            {this.props.children}
        </Template>
    }

}
