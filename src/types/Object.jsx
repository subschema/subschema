"use strict";

import React, {Component}  from 'react';
import PropTypes  from '../PropTypes';
import {FREEZE_OBJ, toArray,push, isString, isArray, unique, path, clone, noop}  from '../tutils';
import Editor  from '../components/Editor';
import ValueManager  from '../ValueManager';
import map  from 'lodash/collection/map';
import Template  from '../components/Template.jsx';
import warning from '../warning';
var _path = path;

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
            return f;
//            warning(false, 'do not know what %s this is ', f);
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
    static inputClassName = ' ';

    static isContainer = true;

    static noTemplate = true;

    static propTypes = {
        objectTemplate: PropTypes.template,
        schema: PropTypes.schema,
        subSchema: PropTypes.schema,
        onButtonClick: PropTypes.event,
        onSubmit: PropTypes.event,
        buttons: PropTypes.buttons,
        path: PropTypes.path
    };

    static defaultProps = {
        onButtonClick: noop,
        onSubmit: noop,
        objectTemplate: 'ObjectTemplate'
    };

    static normalizeSchema = normalizeSchema;

    static normalizeFieldsets = normalizeFieldsets;

    static contextTypes = PropTypes.contextTypes;


    componentWillMount() {
        this.updateProps(FREEZE_OBJ, this.props);
    }

    componentWillReceiveProps(newProps) {
        this.updateProps(this.props, newProps);
    }

    updateProps(oldProps, newProps) {
        var field = newProps.field || newProps;
        this.schema = ObjectType.normalizeSchema(field.subSchema || field.schema, this.context.loader, field.fields, field.fieldsets);
    }

    makeFieldset = (f, i)=> {
        return <Template template={f.template || 'FieldSetTemplate'} key={'f' + i} field={f} {...f}
                         onSubmit={this.handleSubmit}
                         onButtonClick={this.handleButtonClick}
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
        return <Editor key={'key-' + f} path={_path(this.props.path, f)}
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
                    warning(false, 'No type info for "%s" probably a typo in fieldsets', f);
                    return null;
                }
                if (!ref.type) {
                    ref.type = 'Text';
                }
            }
            if (mappedFields || ref.fields || ref.fieldsets) {
                var {fieldsets, fields, ...rest} = ref;
                rest.fieldsets = ObjectType.normalizeFieldsets(fieldsets, fields || mappedFields);
                ref = rest;
            }
            return this.addEditor(ref, f);
        });
    }

    renderSchema() {
        return map(this.schema.fieldsets, this.makeFieldset);
    }

    handleButtonClick = (e, action, ...rest)=> {
        if (this.props.onButtonClick(e, action, ...rest) !== false) {
            if (action === 'submit') {
                this.props.onSubmit(e, ...rest);
            }
        }
    }

    handleSubmit = (...rest)=> {
        this.props.onSubmit(...rest);
    }

    render() {
        //capture the things that should not fall through.
        var {schema, subSchema, title, fields, submitButton, conditional, template, ...props} = this.props;
        return <Template template={this.schema.template || this.props.objectTemplate}
                         onValidate={this.handleValidate}
                         schema={this.schema}
                         className={this.props.className}
                         title={title === false ?'' : title}
            {...props}
                         onButtonClick={this.handleButtonClick}
                         onSubmit={this.handleSubmit || this.props.onSubmit}
        >
            {this.schema && this.schema.schema ? this.renderSchema() : null}

            {this.props.children}
        </Template>
    }

}
