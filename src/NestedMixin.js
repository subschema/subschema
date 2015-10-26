"use strict";
var React = require('./react');
var tu = require('./tutils');
var toArray = tu.toArray;
var Editor = require('./Editor');
var ValueManager = require('./ValueManager');
var LoaderMixin = require('./LoaderMixin');
var warning = require("react/lib/warning");
var map = require('lodash/collection/map');
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

function extractSchema(props) {
    if (props.subSchema) {
        var {fields, fieldsets, subSchema } = props
        return {
            fields,
            fieldsets,
            schema: subSchema
        }
    }
    return props.schema
}
function normalizeFieldsets(fieldsets, fields) {
    if (!(fieldsets || fields)) return [];
    //fields trump fieldsets
    if (fields) {
        fields = toArray(fields);
        return {
            fields
        }
    }
    //otherwise recurse
    return toArray(fieldsets).map((f)=> {
        if (f.fields) {
            var {fields, ...rest} = f;
            rest.fields = toArray(fields);
            return rest;
        } else if (f.fieldsets) {
            var {fieldsets, ...rest} = f;
            rest.fieldsets = normalizeFieldsets(fieldsets);
            return rest;
        } else if (tu.isString(f) || tu.isArray(f)) {
            return {
                fields: toArray(f)
            }
        } else if (f.fieldsets) {
            var {fieldsets, ...rest} = f;
            rest.fieldsets = normalizeFieldsets(fieldsets);
            f.fieldsets = normalizeFieldsets(f.fieldsets);
            return rest;
        } else {
            console.log('do not know what %s this is ', fieldset);
        }
    });
}

function normalizeSchema(oschema, loader) {
    if (oschema == null) {
        return {};
    }

    if (tu.isString(oschema)) {
        var loaded = loader.loadSchema(oschema);
        return normalizeSchema(loaded, loader);
    } else if (tu.isString(oschema.schema)) {
        var {schema, ...rest} = oschema;
        rest.schema = loader.loadSchema(schema);
        return normalizeSchema(rest, loader);
    }
    if (!oschema.schema) {
        return normalizeSchema({
            schema: oschema
        }, loader);
    }
    var {fields, fieldsets, ...schema} = oschema;

    if (!(fields || fieldsets)) {
        fieldsets = [{fields: Object.keys(schema.schema)}];
    }
    schema.fieldsets = normalizeFieldsets(fieldsets, fields);
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
        if (this.props.value) {
            this.props.valueManager.setValue(this.props.value);
        }
        if (this.props.errors) {
            this.props.valueManager.setErrors(this.props.errors);
        }
        this.schema = normalizeSchema(extractSchema(this.props), this.props.loader);
    },
    componentWillReceiveProps(newProps){
        this.schema = normalizeSchema(extractSchema(newProps), this.props.loader);
    },

    makeFieldset(f, i) {
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


    getValue(){
        return this.props.valueManager.path(this.props.path);
    },
    addEditor(field, f){
        if (field == null) {
            return null;
        }
        var {path, loader, ...props} = this.props;
        var tmpl = {}, path = tu.path(path, f);
        if (field.template) {
            tmpl['template'] = field.template;
        }
        return <Editor ref={f} key={'key-' + f} path={path}
                       field={field}
                       loader={loader}
                       name={f}
            {...tmpl}
                       valueManager={this.props.valueManager}/>
    },
    makeFields(fields) {
        var fieldMap = {}, schema = this.schema.schema;

        fields = toArray(fields).map((v) => {
            return v.split('.', 2);
        }).map((v) => {
            var f = v[0];
            if (v.length > 1) {
                (fieldMap[f] || (fieldMap[f] = [])).push(v[1]);
            }
            return f;
        });


        return tu.unique(fields).map((f, i) => {
            f = tu.isString(f) ? f : f && f.name || 'field-' + i;
            var ref = tu.isString(f) ? tu.clone(schema[f]) : f;
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
            if (!ref.fields && fieldMap[f]) {
                ref.fields = fieldMap[f];
            }
            return this.addEditor(ref, f);
        });
    },

    renderSchema() {
        return map(this.schema.fieldsets, this.makeFieldset);
    },

    render() {

        var {schema, subSchema,  fields, submitButton,  template, ...props} = this.props;

        var sb = submitButton || this.schema.submitButton;
        var Template = this.template(template);
        return <Template ref="form" onValidate={this.handleValidate} onSubmit={this.handleSubmit} schema={this.schema}
                         className={this.props.className}
            {...props}
                         loader={this.props.loader}
                         valueManager={this.props.valueManager}
            >
            {this.schema && this.schema.schema ? this.renderSchema(this) : null}
            {sb ?
                <button type="submit" className='btn btn-primary' dangerouslySetInnerHTML={{__html: sb}}/> : null}
            {this.props.children}
        </Template>
    }

}
NestedMixin.normalizeSchema = normalizeSchema;
NestedMixin.extractSchema = extractSchema;
module.exports = NestedMixin;
