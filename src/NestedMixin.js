var React = require('./react');
var tu = require('./tutils');
var Editor = require('./Editor');
var loader = require('./loader');
var ValueManager = require('./ValueManager')
var NestedMixin = {
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
        var Template = loader.loadTemplate(f.template || 'FieldSetTemplate');
        return <Template key={'f' + i} field={f}>
            {this.makeFields(f.fields).map(this.addEditor, this)}
        </Template>
    },


    getValue(){
        return this.props.valueManager.path(this.props.path);
    },
    addEditor(field){
        var f = field.name;
        var {path} = this.props;
        var tmpl = {}, path = tu.path(path, f);
        if (field.template) {
            tmpl['template'] = field.template;
        }
        return <Editor ref={f} key={'key-' + f} path={path}
                       field={field}
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


        return tu.unique(fields).filter((f)=> {
            return schema[f];
        }).map((f) => {

            var ref = tu.isString(f) ? schema[f] : f;
            if (tu.isString(ref)) {
                ref = {
                    name: f,
                    type: ref
                }
            } else {
                if (!ref.type) {
                    ref.type = 'Text';
                }
                if (!ref.name) {
                    ref.name = f;
                }
            }
            if (!ref.fields && fieldMap[f]) {
                ref.fields = fieldMap[f];
            }
            return ref;
        })
    },
    normalizeSchema(schema){
        if (schema == null) {
            return {};
        }
        if (tu.isString(schema)) {
            var loaded = loader.loadSchema(schema);
            if (loaded.schema) {
                schema = loaded;
            } else {
                schema = {schema: loaded};
            }
        } else if (tu.isString(schema.schema)) {
            var loaded = loader.loadSchema(schema.schema);
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