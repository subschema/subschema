"use strict";

import React, {Component}  from 'react';
import PropTypes  from '../PropTypes';
import {FREEZE_OBJ, toArray,push, isString, isArray, unique, path as _path, clone, noop}  from '../tutils';
import map from 'lodash/collection/map';
import UninjectedField  from '../components/Field';
import UninjectedFieldSet from '../components/FieldSet.jsx';
import warning from '../warning';

export default class ObjectType extends Component {

    static template = false;

    static propTypes = {
        objectTemplate: PropTypes.template,
        schema: PropTypes.schema,
        subSchema: PropTypes.schema,
        onButtonClick: PropTypes.event,
        onSubmit: PropTypes.event,
        buttons: PropTypes.buttons,
        path: PropTypes.path,
        fieldsets: PropTypes.fieldset,
        fields: PropTypes.fields,
        FieldSet: PropTypes.injectClass,
        Field: PropTypes.injectClass

    };

    static defaultProps = {
        onButtonClick: noop,
        onSubmit: noop,
        objectTemplate: 'ObjectTemplate',
        FieldSet: UninjectedFieldSet,
        Field: UninjectedField
    };


    static contextTypes = PropTypes.contextTypes;


    addEditor(f, field, fields, Field) {

        if (field == null) {
            warning(true, 'No field found for %s probably a key in fields does not match in schema', f)
            return null;
        }

        f = typeof f === 'string' ? f : f.name || f;

        return <Field key={'key-' + f} path={_path(this.props.path, f)} field={field} fields={fields}/>
    }

    makeFieldset(f, i, schema, FieldSet, Field) {
        return <FieldSet key={`fieldset-${i}`} {...f} field={f} legend={f.legend}
                         onSubmit={this.handleSubmit}
                         onButtonClick={this.handleButtonClick}>
            {f.fields ? this.makeFields(f.fields, schema, Field) : this.makeFieldsets(f.fieldsets, schema, FieldSet, Field)}
        </FieldSet>
    };


    makeFields(fields, schema, Field) {
        const fieldMap = {};
        const mappedfields = fields.map((field) => {
            var [f, rest] = field.split('.', 2);
            if (rest) {
                (fieldMap[f] || (fieldMap[f] = [])).push(rest);
            }
            return f;
        });

        return unique(mappedfields).map((f, i) => this.addEditor(f, schema[f] || f, fieldMap[f], Field));
    }

    makeFieldsets(fieldsets, schema, FieldSet, Field) {
        if (fieldsets == null) {
            return null;
        }
        return fieldsets.map((f, i)=>this.makeFieldset(f, i, schema, FieldSet, Field));
    }

    renderSchema(schema, FieldSet, Field) {
        return this.makeFieldsets(schema.fieldsets, schema.schema, FieldSet, Field);
    }

    handleButtonClick = (e, action, ...rest)=> {
        if (this.props.onButtonClick(e, action, ...rest) !== false) {
            if (action === 'submit') {
                this.props.onSubmit(e, ...rest);
            }
        }
    };


    render() {
        //capture the things that should not fall through.
        let {schema, subSchema, onButtonClick, submitButton, conditional, FieldSet, Field, children, objectTemplate, template, ...props} = this.props;
        const ObjectTemplate = objectTemplate;
        const rschema = schema || subSchema;

        return <ObjectTemplate schema={rschema} onButtonClick={this.handleButtonClick}  {...props}>
            {rschema != null ? this.renderSchema(rschema, FieldSet, Field) : null}
            {children}
        </ObjectTemplate>
    }

}
