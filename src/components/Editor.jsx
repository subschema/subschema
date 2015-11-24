"use strict";
import React, {Component} from 'react';
import PropTypes from './../PropTypes';
import Template from './Template.jsx';
import {listeners} from './../decorators';
import defaults from 'lodash/object/defaults';
import {forField} from '../css';
import { FREEZE_OBJ, FREEZE_ARR, noop, titlelize, isString, isRegExp,isFunction,toArray,nullCheck} from '../tutils';

const ERRORS = {
    '.': 'setErrors'
}, VALUES = {
    '.': 'handleValueChange'
}, VALIDATE = {
    '.': 'handleValidateListener'
}, EMPTY = FREEZE_OBJ;

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


var ptemplate = PropTypes.template, prtemplate = ptemplate.isRequired,
    poptions = PropTypes.options, proptions = poptions.isRequired,
    pschema = PropTypes.schema, prschema = pschema.isRequired
    ;

export default class Editor extends Component {

    static contextTypes = PropTypes.contextTypes;

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
        this.createPropForType(props, context);
    }

    componentWillReceiveProps(props, context) {
        this.initValidators(props, context);
        this.createPropForType(props, context);
        this.listenTo();
        this.listenToError();

    }

    normalizePropType(propType, value) {
        if (value == null || value === false) {
            return value
        }
        if (poptions === propType || proptions === propType) {
            return toArray(value).map(function (v) {
                if (isString(v)) {
                    return {
                        label: v,
                        val: v
                    }
                }
                return v;
            });
        }
        if (ptemplate === propType || prtemplate === propType) {
            if (isString(value)) {
                var template = this.context.loader.loadTemplate(value)
                return template || value;
            }
            if (value === false) {
                return false;
            }
        }
        if (pschema === propType || prschema === propType) {
            if (isString(value)) {
                var schema = this.context.loader.loadSchema(value);
                return schema || value;
            }
        }

        return value;
    }

    initValidators(props, context) {
        var vals = props.field.validators;
        this.validators = vals ? toArray(vals).map(initValidators, context.loader) : FREEZE_ARR;
    }

    handleValidate = (value, component, e)=> {
        this.state.hasValidated = true;
        this.validate(value, this.getErrorMessages(value));
    }

    setErrors(errors) {
        this.setState({errors});
    }

    @listeners("value")
    listenTo() {
        if (this._Component.isContainer) {
            return EMPTY;
        }
        return VALUES;
    }

    @listeners("error")
    listenToError() {
        if (this._Component.isContainer) {
            return EMPTY;
        }
        return ERRORS;
    }

    @listeners("validate", false)
    _handleValidate() {
        if (this._Component.isContainer) {
            return EMPTY;
        }
        return VALIDATE;
    }

    handleValueChange(value, oldValue, name) {
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

    handleValidateListener() {
        var value = this.getValue();
        this.validate(value, this.getErrorMessages(value));
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
            this.setState({value});
            return this.props.onValueChange(value);
        }

        return false;
    }

    createPropForType(props, context) {
        var field = props.field || FREEZE_OBJ;

        var Node = this._Component = context.loader.loadType(field.type);

        var propTypes = Node.propTypes || FREEZE_OBJ, defProps = Node.defaultProps || FREEZE_OBJ;
        var newProps = {};
        Object.keys(propTypes).forEach((key)=> {
            if (key in field) {
                newProps[key] = this.normalizePropType(propTypes[key], field[key]);
            } else if (key in props) {
                newProps[key] = this.normalizePropType(propTypes[key], props[key]);
            } else if (key in defProps) {
                newProps[key] = this.normalizePropType(propTypes[key], defProps[key]);
            }
        }, this);

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

        if (Node instanceof Promise) {
            Component.then((component)=> {
                this._Component = null;
                this._componentProps = null;
                this.forceUpdate();
                return component;
            });
            var Lazy = this.context.loader.loadType('LazyType');
            return Lazy
        }

        this._componentProps = newProps;
    }

    render() {
        var {field} = this.props, props = this.props;
        var pConditional = conditional;
        var {type,fieldClass, conditional, editorClass, errorClassName, ...rfield} = field;
        conditional = conditional || pConditional;
        //err = errors, //&& errors[path] && errors[path][0] && errors[path],
        var title = this.title(),
            handleValidate = this.handleValidate,
            errorClassName = errorClassName == null ? 'has-error' : errorClassName,
            Component = this._Component;

        //Handle Lazy which forces a rerender which causes this to be null and checked again.
        if (Component === null) {
            this.createPropForType(props, this.context);
            Component = this._Component;
        }

        var child = <Component ref="field" {...this._componentProps}
                               value={this.state.value}/>;
        if (title === false) {
            title = '';
        }
        var template = this.props.template
        if (field.template === false || Component.noTemplate === true) {
            template = null;
        } else if (field.template != null) {
            template = field.template;
        }
        var errors = this.state.errors, error;
        if (errors) error = errors[0] && errors[0].message || errors[0];

        return <Template field={rfield} {...props} template={template} conditional={conditional} fieldClass={fieldClass}
                         title={title}
                         errorClassName={errorClassName}
                         error={error}
                         errors={errors}
                         help={!this.state.valid && (props.help || rfield.help)}
                         onValidate={handleValidate}
        >
            {child}
        </Template>
    }
}

module.exports = Editor;