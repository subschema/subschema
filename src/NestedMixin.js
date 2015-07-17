var React = require('./react');
var tu = require('./tutils');
var Editor = require('./Editor');
var ValueManager = require('./ValueManager');
var LoaderMixin = require('./LoaderMixin');
var NestedMixin = {
    mixins:[LoaderMixin],
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
    },
    makeFieldset(f, i) {
        var Template = this.template(f.template || 'FieldSetTemplate');
        return <Template key={'f' + i} field={f}>
            {this.makeFields(f.fields)}
        </Template>
    },


    getValue(){
        return this.props.valueManager.path(this.props.path);
    },
    addEditor(field, f){
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

        fields = tu.toArray(fields).map((v) => {
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
    normalizeSchema(schema){
        if (schema == null) {
            return {};
        }
        if (tu.isString(schema)) {
            var loaded = this.props.loader.loadSchema(schema);
            if (loaded.schema) {
                schema = loaded;
            } else {
                schema = {schema: loaded};
            }
        } else if (tu.isString(schema.schema)) {
            var loaded = this.props.loader.loadSchema(schema.schema);
            if (loaded.schema) {
                schema = loaded;
            } else {
                schema = {schema: loaded};
            }
        }
        return schema;
    },

    renderSchema() {

        var schema = this.schema, fieldsets = schema.fieldsets, fields = schema.fields || Object.keys(schema.schema);
        return (fieldsets && Array.isArray(fieldsets) ? fieldsets : ( fieldsets && (fieldsets.legend || fieldsets.fields) ) ? [fieldsets] : [{fields: tu.toArray(fields)}])
            .map(this.makeFieldset, this);
    }
}
module.exports = NestedMixin;
