var React = require('react');
var tu = require('./tutils');
var Editor = require('./Editor.jsx');
var loader = require('./loader.jsx');

var NestedMixin = {
    getDefaultProps() {
        return {
            path: null,

            schema: {},
            onValueChange() {
            },
            onValidate(){
            },
            form: null
        }

    },
    componentWillReceiveProps(props){
        this.setState({
            value: props.value,
            errors: props.errors
        })
    },
    getInitialState(){
        return {
            value: this.props.value,
            errors: this.props.errors
        }
    },
    componentDidMount(){
        this.setValue(this.props.value);
        this.setErrors(this.props.errors);
    },

    setValue(newValue, oldValue, property, path){
        if (property == null) {
            tu.values(this.refs).forEach((ref)=> {
                ref.refs.field.setValue(newValue && newValue[ref.props.name]);
            });
        } else if (path != null) {
            var parts = path.split('.', 2);
            // if (parts.length > 1) {
            this.refs[parts[0]].refs.field.setValue(newValue, oldValue, property, parts[1]);
            // }else{
            //   this.refs[path].refs.field.refs[property].setValue(newValue, oldValue, property);

            //}
        } else {
            this.refs[property].setValue(newValue, oldValue, property);
        }
    },
    setErrors(errors, newValue, oldValue, property, path){
        if (property == null) {
            tu.values(this.refs).forEach((ref)=> {
                ref.setErrors && ref.setErrors(errors);
            });
        } else {
            var {key, rest} = path.split('.', 2);
            this.refs[key].editor.setErrors(errors, newValue, oldValue, property, rest);
        }
        this.state.errors = errors;
    },
    makeFieldset(f, i) {
        var Template = loader.loadTemplate(f.template || 'FieldSetTemplate');
        return <Template key={'f' + i} field={f}>
            {this.makeFields(f.fields).map(this.addEditor, this)}
        </Template>
    },

    handleValueChange(newValue, oldValue, property, path) {

        if (this.props.onValueChange(newValue, oldValue, property, path) !== false) {
            if (this.form === this) {
                this.setValue(newValue, oldValue, property, path);
            }
        }
    },

    handleValidate(errors, newValue, oldValue, property, path){
        if (this.props.onValidate(newValue, oldValue, property, path) !== false) {
            if (this.form === this) {
                var e = {};
                e[path] = errors;
                this.form.setErrors(e);
            }
        }
    },
    getErrorMessages(){
        var refs = this.refs;
        var errors = tu.flatten(Object.keys(refs).map((v) => {
            var ers = refs[v] && refs[v].editor.getErrorMessages();
            if (ers == null || ers.length === 0) return 0;
            var msg = {};
            msg[refs[v].props.path] = ers;
            return msg;
        }).filter(tu.nullCheck));
    },
    /**
     * Return null if no validation errors,
     * otherwise return a map of errors.
     */
        validate(){
        var refs = this.refs, msgs = null;
        Object.keys(refs).forEach((v) => {
            var ref = refs[v], ers;

            //So nested forms do their own validation.
            if (ref.refs.field.validate) {
                ers = ref.refs.field.validate();
                if (ers == null) return null;
                if (!msgs)msgs = {};
                Object.keys(ers).forEach((v)=> {
                    msgs[v] = ers[v];
                });
            } else {
                //otherwise the editor does it.  I know wierd,
                //open to suggestions.
                ers = ref.validate();
                if (ers == null || ers.length === 0) return null;
                if (msgs == null) msgs = {};
                msgs[ref.props.path] = ers;
            }
        });
        return msgs;
    },
    getValue(){
        var refs = this.refs, value = {};
        Object.keys(refs).forEach((v) => {
            value[v] = refs[v].getValue();
        });
        return value;
    },
    addEditor(field){
        var f = field.name;
        var {path} = this.props;
        var {value, errors} = this.state;
        var tmpl = {};
        if (field.template) {
            tmpl['template'] = field.template;
        }
        return <Editor ref={f} key={'key-' + f} path={tu.path(path, f)} value={value && value[f]}
                       field={field}
                       errors={errors}
                       name={f}
                       form={this.form}
            {...tmpl}
                       onValueChange={this.handleValueChange} onValidate={this.handleValidate}/>
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

            var ref = _.isString(f) ? schema[f] : f;
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
    renderSchema(form) {
        if (form) {
            this.form = form;
        } else {
            this.form = this;
        }
        var schema = this.schema, fieldsets = schema.fieldsets, fields = schema.fields || Object.keys(schema.schema);
        return (fieldsets && Array.isArray(fieldsets) ? fieldsets : ( fieldsets && (fieldsets.legend || fieldsets.fields) ) ? [fieldsets] : [{fields: tu.toArray(fields)}])
            .map(this.makeFieldset, this);
    }
}
module.exports = NestedMixin;