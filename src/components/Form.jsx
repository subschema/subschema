"use strict";

import React, {Component} from "react";
import PropTypes from "./../PropTypes";
import ValueManager from "./../ValueManager";
import ObjectType from "./../types/Object";
import {noop} from "./../tutils";

export default class Form extends Component {
    static displayName = "Form";

    static childContextTypes = {validate: PropTypes.bool, noValidate: PropTypes.bool, ...PropTypes.contextTypes};

    static propTypes = {
        schema: PropTypes.schema.isRequired,
        loader: PropTypes.loader,
        injector: PropTypes.injector,
        valueManager: PropTypes.valueManager,
        template: PropTypes.string,
        method: PropTypes.string,
        action: PropTypes.string,
        enctype: PropTypes.string,
        //handy submit handler.
        onSubmit: PropTypes.event,
        //Set this to true if you don't want validation to run on submit.
        noValidate: PropTypes.bool,
        //Set this to true, if you want validators to be called against the current schema.  I.E. after a POST.
        validate: PropTypes.bool
    };

    static defaultProps = {
        fallbackTemplate: 'FormTemplate',
        noValidate: false,
        validate: false
    };

    constructor(props, context, whatever) {
        super(props, context, whatever);
        this.loader = props.loader;
        this.injector = props.injector;
        if (!props.valueManager) {
            this.valueManager = ValueManager(props.value, props.errors);
        } else {
            this.valueManager = props.valueManager;
            if (props.value) {
                this.valueManager.setValue(props.value);
            }
            if (props.errors) {
                this.valueManager.setErrors(props.errors);
            }
        }
        this.ObjectWrapper = this.injector.inject(ObjectType);
        if (props.onSubmit)
            this._submitListener = this.valueManager.addSubmitListener(null, props.onSubmit).remove;
    }
    getChildContext() {
        return {
            valueManager: this.valueManager,
            loader: this.loader,
            injector: this.injector,
            validate: this.props.validate,
            noValidate: this.props.noValidate
        };
    }
    componentWillReceiveProps(newProps) {

        if (newProps.loader !== this.props.loader) {
            this.loader = newProps.loader;
        }
        if (newProps.valueManager !== this.props.valueManager) {
            if (this._submitListener) {
                this._submitListener();
            }
            this.valueManager = newProps.valueManager;
            this.forceUpdate();
        }

        if (this.props.value !== newProps.value) {
            this.valueManager.setValue(newProps.value);
        }
        if (this.props.errors !== newProps.errors) {
            this.valueManager.setErrors(newProps.errors);
        }
        if (this.props.injector !== newProps.injector) {
            this.injector = newProps.injector;
            this.ObjectWrapper = this.injector.inject(ObjectType);
        }

        if (newProps.onSubmit) {
            if (this._submitListener) {
                this._submitListener();
            }
            this._submitListener = this.valueManager.addSubmitListener(null, newProps.onSubmit).remove;
        }
    }

    componentWillUnmount() {
        this._submitListener && this._submitListener();
    }

    getValue() {
        return this.valueManager.getValue();
    }

    setErrors = (errors)=> {
        this.valueManager.setErrors(errors);
    };


    render() {

        const {valueManager, injector, loader, validate, template, onSubmit, ...props} = this.props;
        const ObjectWrapper = this.ObjectWrapper;
        return <ObjectWrapper {...props} objectTemplate={template}/>
    }

}
