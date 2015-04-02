var React = require('react');
var tu = require('./tutils');
var EMPTY_OBJ = {};
var EMPTY_ARR = [];
var validators = require('./validators');
var EditorTemplate = require('./templates/EditorTemplate.jsx');
function initValidators(v) {
    //If it has a type init it
    if (v.type) {
        return validators[v.type].call(validators, v);
    }
    //If it is a RegExp than init ReExp
    if (_.isRegExp(v)) {
        return validators['regexp']({
            regexp: v
        })
    }
    //If its a function just return it.
    if (_.isFunction(v)) {
        return v;
    }
    //otherwise lets try initing it.
    return validators[v]();
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
            template: EditorTemplate

        }
    },
    getInitialState(){
        return {}
    },

    componentWillMount(){
        var validators = this.props.field.validators;
        this.validators = validators ? validators.map(initValidators) : EMPTY_ARR;
    },
    handleValidate(newValue, oldValue, path) {
        this.validate(newValue, oldValue, path);
    },
    handleChange(newValue, oldValue, name) {
        var errors = this.getErrorMessages(newValue), isValid = errors.length === 0;
        //if (isValid) {
        this.props.onValueChange(newValue, oldValue, name, this.props.path);
        var hasValidated = this.state.hasValidated;
        if (!hasValidated && !isValid) {
            //don't show errors on change if it has never been validated.
            errors = null;
        } else if (!hasValidated && isValid) {
            hasValidated = true;
        }

        this.setState({
            hasValidated
        });


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
            this.setState({
                hasValidated: true
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
        var {field, name, value, errors, path, onValueChange,  template,onValidate, ...props} = this.props,
            {name,type,fieldClass, errorClassName, help} = field,
            err = errors && errors[path] && errors[path][0] && errors[path],
            errMessage = err && err[0].message,
            Component = require('types/' + type + '.jsx'),
            title = this.title(),
            errorClassName = errorClassName == null ? 'has-error' : errorClassName;
        var Template = template;
        if (template === false || field.template === false || type === 'Hidden') {
            Template = null;
        } else {
            Template = EditorTemplate;
        }
        //errMessage, errorClassName, name, fieldClass, title, help
        return Template ? <Template name={name} fieldClass={fieldClass} title={title} help={help}
                                    errorClassName={errorClassName} message={errMessage}>
            <Component ref="field" value={value} {...props} field={field} name={name} form={this.props.form}
                       error={err}

                       onValueChange={this.handleChange}
                       onValidate={this.handleValidate}/>
        </Template> :
            <Component ref="field" value={value} {...props} field={field} name={name} form={this.props.form}
                       error={err}
                       onValueChange={this.handleChange}
                       onValidate={this.handleValidate}/>;

    }
});
module.exports = Editor;