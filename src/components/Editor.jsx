"use strict";
import React, {Component} from 'react';
import PropTypes from './../PropTypes';
import Template from './Template.jsx';
import {listeners} from './../decorators';
import defaults from 'lodash/object/defaults';
import {forField} from '../css';
import { FREEZE_OBJ, applyFuncs, each, nextFunc, FREEZE_ARR, noop, titlelize, isString,toArray,nullCheck} from '../tutils';
import substitute from '../types/SubstituteMixin';
import warning from '../warning';

const ERRORS = {
    '.': 'setErrors'
}, VALUES = {
    '.': 'handleValueChange'
}, VALIDATE = {
    '.': 'handleValidateListener'
}, EMPTY = FREEZE_OBJ;

/**
 * Apply function with scope to every key in each object that has not been
 * seen before.
 *
 * If the function returns undefined that it will not add the key
 *
 * @param fn
 * @param scope
 * @param args - the object to iterate over.
 * @return {} - object containing the keys and the value return from the function
 */

function uniqueKeyEach(fn, scope, ...args) {
    var i = 0, j = 0, jl = 0, l = args.length, ans, keys = FREEZE_ARR, arg, uniq = {}, obj;
    for (; i < l; i++) {
        obj = args[i];
        if (obj == null) continue;
        keys = Object.keys(obj);
        for (j = 0, jl = keys.length; j < jl; j++) {
            var key = keys[j];
            if (!uniq.hasOwnProperty(key)) {
                ans = fn.call(scope, obj[key], key);
                if (ans !== void(0)) {
                    uniq[key] = ans;
                }
            }
        }
    }
    return uniq;
}

export default class Editor extends Component {

    static contextTypes = PropTypes.contextTypes;

    static expressionEngine = substitute;

    static defaultProps = {
        field: {
            type: 'Text'
        },
        onChange: noop,
        onBlur: noop,
        onValueChange: noop,
        template: 'EditorTemplate'
    }
    /**
     * All Types have the following automatically injected.
     * @type {{name: *, onChange: *, className: *, id: *}}
     */
    static fieldPropTypes = {
        name: PropTypes.name,
        onChange: PropTypes.targetEvent,
        onBlur: PropTypes.blurEvent,
        className: PropTypes.cssClass,
        id: PropTypes.id,
        type: PropTypes.dataType,
        fieldAttrs: PropTypes.fieldAttrs,
        placeholder: PropTypes.placeholder
    }


    constructor(props, context, ...rest) {
        super(props, context, ...rest);
        this.state = {
            hasChanged: false,
            isValid: false
        };
        this._substitute = [];
        this.initValidators(props, context);
        this.initPropTypes(props, context);
    }

    componentWillReceiveProps(props, context) {
        this.initValidators(props, context);
        this.initPropTypes(props, context);
        this.listenTo();
        this.listenToError();

    }

    initValidators(props, context) {
        this.validators = context.loader.loadByPropType(PropTypes.validators, props.field.validators);
    }

    addExpression(property, expression) {
        expression = Editor.expressionEngine(expression);
        if (!this._expressions) {
            this._expressions = {[property]: expression};
        } else {
            warning(this._expressions[property] == null, 'Multiple expressions for the same property %s?', property);
            this._expressions[property] = expression;
        }
    }

    initPropTypes(props, context) {
        var Component = this._Component = this.createPropForType(props, context);
        //Handle Lazy which forces a rerender which causes this to be null and checked again.
        if (Component instanceof Promise) {
            Component.then((component)=> {
                this._Component = null;
                this._componentProps = null;
                this.forceUpdate();
                return component;
            });
            Component = this.context.loader.loadType('LazyType');
        }

    }

    createPropForType(props, context) {
        var field = props.field || FREEZE_OBJ;
        var path = field.conditional && field.conditional.path || props.path;
        var Node = context.loader.loadType(field.type);

        var propTypes = Node.propTypes || FREEZE_OBJ,
            overrideProps = {
                type: field.dataType,
                id: path
            },
            defaultProps = Node.defaultProps || FREEZE_OBJ,
            generatedDefs = {
                className: forField(Node, field.fieldClass),
                name: props.name || path
            };
        var newProps = uniqueKeyEach((propType, key)=> {
            var val;
            if (overrideProps.hasOwnProperty(key)) {
                val = overrideProps[key];
            } else if (field.hasOwnProperty(key)) {
                val = field[key];
            } else if (props.hasOwnProperty(key)) {
                val = props[key];
            } else if (defaultProps.hasOwnProperty(key)) {
                val = defaultProps[key];
            } else if (generatedDefs.hasOwnProperty(key)) {
                val = generatedDefs[key];
            }
            return this.normalizePropType(propType, val, key);
        }, this, propTypes, Editor.fieldPropTypes);

        //change in behaviour fieldAttrs come afterward
        if (field.fieldAttrs) {
            defaults(newProps, field.fieldAttrs);
        }

        this._componentProps = newProps;
        return Node;
    }

    normalizePropType(propType, value, property) {
        if (propType === PropTypes.valueEvent || propType === PropTypes.valueEvent.isRequired) {
            return nextFunc(value, this.handleUpdateValue);
        } else if (propType === PropTypes.targetEvent || propType === PropTypes.targetEvent.isRequired) {
            return nextFunc(value, this.handleTargetValue);
        } else if (propType === PropTypes.blurEvent || propType === PropTypes.blurEvent.isRequired) {
            return nextFunc(value, this.handleValidateListener);
        } else if (propType === PropTypes.validEvent || propType === PropTypes.validEvent.isRequired) {
            return nextFunc(value, this.handleValid);
        } else if (propType === PropTypes.expression || propType === PropTypes.expression.isRequired) {
            this.addExpression(property, value);
        }
        return this.context.loader.loadByPropType(propType, value);
    }

    handleTargetValue = (e)=> {
        this.handleUpdateValue(e.target.value);
    }
    handleUpdateValue = (value)=> {
        if (this.props.onChange(value) === false) {
            return false;
        }
        var field = this.props.field || FREEZE_OBJ;
        var path = field.conditional && field.conditional.path || this.props.path;

        if (this.context.valueManager.update(path, value) !== false) {

            return this.props.onValueChange(value);
        }

        return false;
    }

    handleValueChange(value, oldValue, name) {

        this.setState({value});

        this.state.hasChanged = true;

        var errors = this.getErrorMessages(value);
        if (!this.state.hasValidated) {
            if (!errors || errors.length === 0) {
                this.state.hasValidated = true;
            }
        } else {
            this.validate(value, errors);
        }
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
        var listeners;

        if (this.props.field.conditional && this.props.field.conditional.path) {
            if (!listeners) listeners = {};
            listeners[this.props.field.conditional.path] = 'handleValueChange';
        }

        if (this._expressions) {
            if (!listeners) {
                var {...listeners} = VALUES;
            }
            //Go through each property expression pair and store the state.
            each(this._expressions, (expression, property)=> {
                expression.listen.reduce((obj, key)=> {
                    obj[key] = applyFuncs((v)=> {
                        if (!expression.state) {
                            expression.state = {[key]: v};
                        } else {
                            expression.state[key] = v;
                        }
                        this.forceUpdate();
                    }, obj[key]);

                    return obj;
                }, listeners);
            });
        }
        return listeners || VALUES;
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

    handleValidateListener = ()=> {
        this.validate(this.state.value, this.getErrorMessages(this.state.value));
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

    handleValid = (valid)=> {
        this.setState({valid})
    }

    _invokeExpression(expression, property) {
        this[property] = expression.format(expression.state);
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

        var expressions;
        if (this._expressions) {
            expressions = {};
            each(this._expressions, this._invokeExpression, expressions);
        } else {
            expressions = FREEZE_OBJ;
        }

        var child = <Component ref="field" {...this._componentProps} {...expressions}
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