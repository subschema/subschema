var React = require('react');
var tu = require('./tutils'), tpath = tu.path;
var Editor = require('./Editor.jsx');

var NestedMixin = {
    getDefaultProps() {
        return {
            template: null,
            path: null,
            schema: {},
            value: {},
            errors: {},
            onValueChange() {

            },
            onValidate(){
            },
            form: null
        }

    },
    getInitialState(){
        return {};
    },

    makeFieldset(f, i) {

        var ret = f.legend ?
            <fieldset key={'f' + i}>
                <legend>{f.legend}</legend>
                {this.makeFields(f.fields).map(this.addEditor, this)}
            </fieldset> :
            <div key={'f' + i}>{this.makeFields(f.fields).map(this.addEditor, this)}</div>
        return ret;
    },

    handleValueChange(newValue, oldValue, property, path) {

        if (this.props.onValueChange(newValue, oldValue, property, path) !== false) {
            if (this.form === this) {
                this.setValue(path, newValue, this.props.value);
            }
        }
    },
    setValue(path, newValue, value){
        var parts = path.split('.', 2), key = parts[0], rest = parts[1];
        if (rest != null) {
            value = value[key] == null ? (value[key] = {}) : value[key];
            this.refs[key].refs.field.setValue(rest, newValue, value);
        } else {
            value[path] = newValue;
        }
    },

    setErrors(errors, newValue, oldValue, property, path, value){
        var parts = path.split('.', 2), key = parts[0], rest = parts[1];
        value[path] = errors;

    },
    handleValidate(errors, newValue, oldValue, property, path){
        if (this.props.onValidate(newValue, oldValue, property, path) !== false) {
            if (this.form === this) {
                this.setErrors(errors, newValue, oldValue, property, path, this.props.errors);
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
        var {path, value, errors} = this.props;
        return <Editor ref={f} key={'key-' + f} path={tu.path(path, f)} value={value && value[f]}
                       field={field}
                       errors={errors}
                       form={this.form}
                       template={field.template}
                       onValueChange={this.handleValueChange} onValidate={this.handleValidate}/>
    },
    makeFields(fields) {
        var fieldMap = {}, schema = this.schema.schema, template = this.props.template;

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
                    type: ref,
                    template: template
                }
            } else {
                if (!ref.type) {
                    ref.type = 'Text';
                }
                if (!ref.name) {
                    ref.name = f;
                }
                if (!ref.template) {
                    ref.template = template;
                }

            }
            if (!ref.fields && fieldMap[f]) {
                ref.fields = fieldMap[f];
            }
            return ref;
        })
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