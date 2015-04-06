var React = require('react');
var tu = require('./tutils');
var EMPTY_ARR = [];
var loader = require('./loader.jsx');

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
        var errors = this.props.errors;
        return {
            errors: errors,
            value: this.props.value,
            hasValidated: errors != null
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
        this.setState({errors});
    },

    componentWillMount(){
        var validators = this.props.field.validators;
        this.validators = validators ? validators.map(initValidators) : EMPTY_ARR;
    },
    handleValidate(newValue, oldValue, path) {
        this.checkAndMaybeValidate(newValue, oldValue);
    },
    checkAndMaybeValidate(newValue, oldValue){
        var hasChanged = newValue !== oldValue;
        if (!hasChanged) {
            return;
        }
        var hasValidated = this.state.hasValidated;
        if (hasValidated) {
            this.validate(newValue);
        }

    },

    handleChange(newValue, oldValue, name) {
        var hasChanged = newValue !== oldValue;
        if (!hasChanged) {
            return;
        }
        if (this.props.onValueChange(newValue, oldValue, name, this.props.path) !== false) {
            this.checkAndMaybeValidate(newValue, oldValue);
        }

    },
    getValue(){
        return this.refs.field.getValue();
    },

    /**
     * Runs validation and updates empty fields.
     *
     */
        validate(value){
        value = arguments.length === 0 ? this.getValue() : value;
        var errors = this.getErrorMessages(value);
        if (this.props.onValidate(errors, value, this.props.value, this.props.name, this.props.path) !== false) {
            var eo = this.state.errors || {};
            eo[this.props.path] = errors && errors.length ? errors : null;
            this.setState({
                hasValidated: true,
                errors: eo
            });
        }
        return errors;
    },

    getErrorMessages(value){
        value = arguments.length === 0 ? this.getValue() : value;
        var form = this.props.form ? this.props.form : this.refs.field && this.refs.field.form;

        var values = form && form.getValue();
        return this.validators.map((v)=> {
            return v(value, values);
        }).filter(tu.nullCheck);
    },


    title: function () {
        var field = this.props.field || {};
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
        var {name,type,fieldClass, errorClassName, help} = field;

        var errors = this.state.errors,
            err = errors && errors[path] && errors[path][0] && errors[path],
            errMessage = err && err[0].message,
            Component = loader.loadType(type),
            title = this.title(),
            errorClassName = errorClassName == null ? 'has-error' : errorClassName;
        var Template;
        if (template === false || field.template === false || type === 'Hidden') {
            Template = null;
        } else {
            Template = loader.loadTemplate(template || 'EditorTemplate');
        }
        var field = <Component ref="field" {...props} field={field} name={name} form={this.props.form}
                               error={err}
                               path={path}
                               errors={errors}
                               value={this.state.value}
                               onValueChange={this.handleChange}
                               onValidate={this.handleValidate}/>;
        //errMessage, errorClassName, name, fieldClass, title, help
        return Template ? <Template name={name} fieldClass={fieldClass} title={title} help={help}
                                    errorClassName={errorClassName} message={errMessage}>
            {field}
        </Template> :
            field;

    }
});
module.exports = Editor;