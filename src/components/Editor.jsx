"use strict";
import React, {Component} from 'react';
import PropTypes from './../PropTypes';
import Template from './Template.jsx';
import {listen} from './../decorators';
import defaults from 'lodash/object/defaults';
import {forField} from '../css';


var { FREEZE_OBJ, FREEZE_ARR, noop, titlelize, isRegExp,isFunction,toArray,nullCheck}  = require('./../tutils');


function initValidators(v) {
    //If it has a type init it
    if (v.type) {
        var validator = this.loadValidator(v.type);
        return validator(v);
    }
    //If it is a RegExp than init ReExp
    if (isRegExp(v)) {
        return this.loadValidator('regexp')({
            regexp: v
        });
    }
    //If its a function just return it.
    if (
        isFunction(v)) {
        return v;
    }
    //otherwise lets try initing it.
    return this.loadValidator(v)();
}
/**
 * //TODO -
 * Make types super dumb. install triggerChange, eventExtract if requested via annotation or static.
 * Otherwise use the props on the types plus the defaults to pass only the defaults needed to the
 * component.
 *
 * @param props
 * @param defProps
 */
function copyProps(props, defProps) {
    var {fieldAttrs, ...rest} = props;
    var {...attrs} = fieldAttrs;
    return defaults(attrs, rest, defProps);
}

export default class Editor extends Component {
    static contextTypes = {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader
    }
    static defaultProps = {
        field: {
            type: 'Text'
        },
        onChange: noop,
        onBlur: noop,
        onValueChange: noop,
        template: 'EditorTemplate'
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            hasChanged: false,
            isValid: false
        };
        this.initValidators(props, context);
    }

    setValue(value) {
        this.refs.field.setValue(value);
    }

    componentWillReceiveProps(newProps, newContext) {
        this.initValidators(newProps, newContext);
    }

    initValidators(props, context) {
        var validators = props.field.validators;
        this.validators = validators ? toArray(validators).map(initValidators, context.loader) : FREEZE_ARR;
    }

    handleValidate(value, component, e) {
        this.state.hasValidated = true;
        this.validate();
    }

    @listen("error", ".")
    handleError(errors) {
        this.setState({errors});
    }

    @listen("value")
    handleChange(value, oldValue, name) {
        if (!(this.state && 'value' in this.state)) {
            //init first value prolly not needed see hasChanged below.
            this.setState({value});
            return;
        }
        var hasChanged = value != oldValue;
        if (!hasChanged) {
            return;
        }
        this.state.hasChanged = true;
        var errors = this.getErrorMessages(value);
        if (!this.state.hasValidated) {
            if (!errors || errors.length === 0) {
                this.state.hasValidated = true;
            }
        } else {
            this.validate(value, errors && errors.length === 0 ? null : errors);
        }
    }

    getValue() {
        return this.context.valueManager.path(this.props.path);
    }

    /**
     * Runs validation and updates empty fields.
     *
     */
    validate(value, errors) {
        value = arguments.length < 1 ? this.getValue() : value;
        errors = arguments.length < 2 ? this.getErrorMessages(value) : errors;
        this.context.valueManager.updateErrors(this.props.path, errors, value);
        if (errors && errors.length === 0) {
            errors = null;
        }
        this.setState({
            hasValidated: true,
            errors: errors
        });
        return errors;
    }

    _validate() {
        this.validate(this.getValue());
    }

    getErrorMessages(value) {
        var vm = this.context.valueManager;

        value = arguments.length === 0 ? this.getValue() : value;
        var msgs = this.validators.map((v)=> {
            return v(value, vm);
        }).filter(nullCheck);
        return msgs;
    }


    title() {
        var field = this.props.field || {};
        if (field.title === false) {
            return null;
        }
        if (field.title != null) {
            return field.title;
        }
        //Add spaces
        return titlelize(this.props.name);
    }

    handleValid(valid) {
        this.setState({valid})
    }

    eventValue(e) {
        return e.target.value;
    }

    handleNodeChange(value, ...rest) {
        if (this.props.onChange(value) === false) {
            return false;
        }
        if (this.context.valueManager.update(this.props.path, value) !== false) {
            return this.props.onValueChange(value);
        }

        return false;
    }

    createPropForType(Node, props) {
        var propTypes = Node.propTypes || FREEZE_OBJ;
        var newProps = {};
        var field = props.field || FREEZE_OBJ;
        Object.keys(propTypes).forEach((key)=> {
            if (key in field) {
                newProps[key] = field[key];
            } else if (key in props)
                newProps[key] = props[key];
        });

        var eventValue = Node.eventValue || this.eventValue,
            className = forField(Node, field),
            name = props.name || props.path,
            onChange = (e, ...rest)=> {
                this.handleNodeChange(eventValue(e), e, ...rest);
            },
            onBlur = (e, ...rest)=> {
                this.handleValidate(eventValue(e), e, ...rest);
            };

        newProps = defaults({
            onChange,
            onBlur,
            type: field.dataType,
            value: this.state.value,
            placeholder: field.placeholder,
            name,
            id: props.path,
            className
        }, field.fieldAttrs, newProps);

        return newProps;
    }

    render() {
        var {field, onValueChange, template, component, onValidate, propsfield, conditional, onValueChange, template, onValidate, ...props} = this.props;
        var pConditional = conditional;
        var {type,fieldClass, conditional, editorClass, errorClassName, ...rfield} = field;
        conditional = conditional || pConditional;
        //err = errors, //&& errors[path] && errors[path][0] && errors[path],
        var Component = component || this.context.loader.loadType(type),
            title = this.title(),
            handleValidate = this.handleValidate.bind(this),
            errorClassName = errorClassName == null ? 'has-error' : errorClassName;
        var child;
        var childProps = this.createPropForType(Component, this.props);
        if (Component instanceof Promise) {
            var Lazy = this.context.loader.loadType('LazyType');
            child = <Lazy ref="field" {...props} {...field} field={rfield} editorClass={editorClass}

                          onValidate={handleValidate} promise={Component}/>
        }
        else {
            child = <Component ref="field" {...childProps}/>;
        }
        if (!title) {
            title = '';
        }
        var template = this.props.template
        if (template === false || field.template === false || type === 'Hidden') {
            template = null;
        } else if (field.template != null) {
            template = field.template;
        }
        var errors = this.state.errors;
        if (errors) errors = errors[0] && errors[0].message || errors[0];

        return <Template template={template} conditional={conditional} field={rfield} {...props} fieldClass={fieldClass}
                         title={title}
                         errorClassName={errorClassName}
                         error={errors}
                         help={!this.state.valid && (props.help || rfield.help)}
                         onValidate={handleValidate}
        >
            {child}
        </Template>
    }
}

module.exports = Editor;