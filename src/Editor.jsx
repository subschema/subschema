var React = require('react');
var tu = require('./tutils');
var EMPTY_ARR = [];
var loader = require('./loader.jsx');
"use strict";
function initValidators(v) {
    //If it has a type init it
    if (v.type) {
        var validator = loader.loadValidator(v.type);
        return validator(v);
    }
    //If it is a RegExp than init ReExp
    if (_.isRegExp(v)) {
        return loader.loadValidator('regexp')({
            regexp: v
        });
    }
    //If its a function just return it.
    if (_.isFunction(v)) {
        return v;
    }
    //otherwise lets try initing it.
    return loader.loadValidator(v)();
}


var Editor = React.createClass({
    displayName: 'Editor',

    getDefaultProps() {
        return {
            field: {
                type: 'Text'
            },
            onValueChange() {
            },
            onValidate() {
            },
            template: 'EditorTemplate'

        }
    },
    getInitialState(){
        return {
            value: this.props.value,
            hasChanged: false
        }
    },
    /*componentWillReceiveProps(props){
     this.setState({
     errors: props.errors
     })
     },*/
    setValue(value){
        this.refs.field.setValue(value);
    },
    setErrors(errors){
        if (this.props.path in errors) {
            this.setState({errors: errors[this.props.path], hasValidated: true});
        } else {
            Object.keys(errors).forEach((key)=> {
                var rest = key.replace(this.props.path + '.', '').split('.', 2), path = rest[0];
                if (this.refs.field.refs[path]) {
                    this.refs.field.refs[path].setErrors(errors);
                } else {
                    this.refs.field.setErrors && this.refs.field.setErrors(errors);
                }

            }, this);
        }
    },

    componentWillMount(){
        var validators = this.props.field.validators;
        this.validators = validators ? validators.map(initValidators) : EMPTY_ARR;
    },
    handleValidate(newValue, oldValue, path) {

        this.state.hasValidated = true;

        this.validate(newValue);


    },

    handleChange(newValue, oldValue, name) {
        var hasChanged = newValue != oldValue;
        if (!hasChanged) {
            return;
        }
        this.state.hasChanged = true;
        if (this.props.onValueChange(newValue, oldValue, name, this.props.path) !== false) {
            var errors = this.getErrorMessages(newValue);
            if (!this.state.hasValidated) {
                if (!errors || errors.length === 0) {
                    this.state.hasValidated = true;
                }
            } else {
                this.validate(newValue, errors);
            }
        }

    },
    getValue(){
        return this.refs.field.getValue();
    },

    /**
     * Runs validation and updates empty fields.
     *
     */
        validate(value, errors){
        value = arguments.length === 0 ? this.getValue() : value;
        errors = errors || this.getErrorMessages(value);
        if (this.props.onValidate(errors, value, this.props.value, this.props.name, this.props.path) !== false) {

            this.setState({
                hasValidated: true,
                errors: errors
            });
        }
        return errors;
    },

    getErrorMessages(value){
        if ((!this.state.hasChanged && this.state.errors)) {
            return this.state.errors;
        }
        value = arguments.length === 0 ? this.getValue() : value;
        var form = this.props.form ? this.props.form : this.refs.field && this.refs.field.form;

        var values = form && form.getValue();
        return this.validators.map((v)=> {
            var ret = v(value, values);
            return ret;
        }).filter(tu.nullCheck);
    },


    title: function () {
        var field = this.props.field || {};
        if (field.title === false) {
            return null;
        }
        if (field.title != null) {
            return field.title;
        }
        //Add spaces
        return field.name.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => {
            return s.toUpperCase();
        });
    },
    render() {
        var {field, name, value, path, onValueChange,  template,onValidate, ...props} = this.props;
        var {name,type,fieldClass, editorClass, errorClassName, help} = field;

        var err = this.state.errors;
        //err = errors, //&& errors[path] && errors[path][0] && errors[path],
        var errMessage = err && err[0] && err[0].message,
            Component = loader.loadType(type),
            title = this.title(),
            errorClassName = errorClassName == null ? 'has-error' : errorClassName;
        var Template;
        if (template === false || field.template === false || type === 'Hidden') {
            Template = null;
        } else {
            Template = loader.loadTemplate(template || 'EditorTemplate');
        }
        var child = <Component ref="field" {...props} field={field} name={name} form={this.props.form}
                               error={err}
                               path={path}
                               editorClass={editorClass}
                               value={this.state.value}
                               onValueChange={this.handleChange}
                               onValidate={this.handleValidate}/>;
        //errMessage, errorClassName, name, fieldClass, title, help
        return Template ? <Template field={field} name={name} fieldClass={fieldClass} title={title} help={help}
                                    errorClassName={errorClassName} message={errMessage}>
            {child}
        </Template> :
            child;

    }
});
module.exports = Editor;