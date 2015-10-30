"use strict";
var React = require('./react');
var tu = require('./tutils');
var {FREEZE_OBJ, FREEZE_ARR} = tu;
var hasPromise = (window && window.Promise || global && global.Promise) !== void(0);
var Conditional = require('./Conditional.jsx');

/**
 * Safe chained function
 *
 * Will only create a new function if needed,
 * otherwise will pass back existing functions or null.
 *
 * @param {function} one
 * @param {function} two
 * @returns {function|null}
 */
function applyFuncs(one, two) {
    let hasOne = typeof one === 'function';
    let hasTwo = typeof two === 'function';

    if (!hasOne && !hasTwo) {
        return null;
    }
    if (!hasOne) {
        return two;
    }
    if (!hasTwo) {
        return one;
    }

    return function chainedFunction() {
        one.apply(this, arguments);
        two.apply(this, arguments);
    };
}


function initValidators(v) {
    //If it has a type init it
    if (v.type) {
        var validator = this.loadValidator(v.type);
        return validator(v);
    }
    //If it is a RegExp than init ReExp
    if (tu.isRegExp(v)) {
        return this.loadValidator('regexp')({
            regexp: v
        });
    }
    //If its a function just return it.
    if (tu.isFunction(v)) {
        return v;
    }
    //otherwise lets try initing it.
    return this.loadValidator(v)();
}


var Editor = React.createClass({
    displayName: 'Editor',
    mixins: [require('./LoaderMixin')],
    getDefaultProps() {
        return {
            field: {
                type: 'Text'
            },
            /*onValueChange() {
             },*/
            onValidate() {
            },
            template: 'EditorTemplate'

        }
    },
    getInitialState(){
        return {
            hasChanged: false,
            isValid: false
        }
    },

    setValue(value){
        this.refs.field.setValue(value);
    },
    componentWillMount(){
        var validators = this.props.field.validators;
        this.validators = validators ? tu.toArray(validators).map(initValidators, this.props.loader) : FREEZE_ARR;
        this._listen(this.props, FREEZE_OBJ);
    },
    componentWillUnmount(){
        this._unlisten();
    },
    componentWillReceiveProps(newProps){
        this._listen(newProps, this.props);
    },
    _listen(newProps, oldProps){
        if (newProps.valueManager === oldProps.valueManager && newProps.path === oldProps.path) {
            return;
        }
        this._unlisten();
        this._listener = newProps.valueManager.addListener(newProps.path, this.handleChange, this, true);
        this._validateListener = newProps.valueManager.addValidateListener(newProps.path, this._validate, this);
    },
    _unlisten(){
        if (this._listener) this._listener.remove();
        if (this._validateListener)  this._validateListener.remove();
    },
    handleValidate(value, component, e) {
        this.state.hasValidated = true;
        this.validate();
    },

    handleChange(newValue, oldValue, name) {
        var hasChanged = newValue != oldValue;
        if (!hasChanged) {
            return;
        }
        this.state.hasChanged = true;
        var errors = this.getErrorMessages(newValue);
        if (!this.state.hasValidated) {
            if (!errors || errors.length === 0) {
                this.state.hasValidated = true;
            }
        } else {
            this.validate(newValue, errors);
        }
    },
    getValue(){
        return this.props.valueManager.path(this.props.path);
    },

    /**
     * Runs validation and updates empty fields.
     *
     */
        validate(value, errors){
        value = arguments.length === 0 ? this.getValue() : value;
        errors = errors || this.getErrorMessages(value);

        this.props.valueManager.updateErrors(this.props.path, errors, value);
        this.setState({
            hasValidated: true
        });
        return errors;
    },
    _validate: function () {
        this.validate(this.getValue());
    },
    getErrorMessages(value){
        var vm = this.props.valueManager;

        value = arguments.length === 0 ? this.getValue() : value;
        var msgs = this.validators.map((v)=> {
            return v(value, vm);
        }).filter(tu.nullCheck);
        return msgs;
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
        return tu.titlelize(this.props.name);
    },
    handleValid: function (valid) {
        this.setState({valid})
    },
    renderContent(field, onValueChange, template, onValidate, props){
        var {type,fieldClass, conditional, editorClass, errorClassName, ...rfield} = field;

        //err = errors, //&& errors[path] && errors[path][0] && errors[path],
        var Component = this.props.loader.loadType(type),
            title = this.title(),
            errorClassName = errorClassName == null ? 'has-error' : errorClassName;
        var Template;
        if (template === false || field.template === false || type === 'Hidden') {
            Template = null;
        } else {
            Template = this.template();
        }
        var child;
        if (hasPromise && Component instanceof Promise) {
            var Lazy = this.props.loader.loadType('LazyType');
            child = <Lazy ref="field" {...props} {...field} field={rfield} editorClass={editorClass}

                          onValidate={this.handleValidate} promise={Component}/>
        }
        else {
            child = <Component ref="field" {...props} {...field} field={rfield} editorClass={editorClass}

                               onValidate={this.handleValidate}/>;
        }
        if (!title) {
            title = '';
        }

        return Template ?
            <Template field={rfield} {...props} fieldClass={fieldClass} title={title}
                      errorClassName={errorClassName}
                      help={!this.state.valid && (props.help || rfield.help)}
                      onValidate={this.handleValidate}
                >
                {child}
            </Template> :
            child;

    },
    render(){
        var {field,  onValueChange, path, conditional, template, onValidate, ...props} = this.props;
        conditional = conditional || field.conditional;
        if (conditional == null || conditional === false) {
            props.path = path;
            return this.renderContent(field, onValueChange, template, onValidate, props);
        }
        if (typeof conditional === 'string') {
            conditional = {operator: conditional};
        }
        props.path = conditional.path  || path;
        return (<Conditional  path={this.props.path} {...conditional} field={field} valueManager={props.valueManager}
                                              loader={props.loader}>
            {this.renderContent(field, onValueChange, template, onValidate, props)}
        </Conditional>);
    }

});
module.exports = Editor;