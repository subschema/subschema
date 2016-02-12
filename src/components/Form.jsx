"use strict";

import React, {Component} from 'react';
import PropTypes from './../PropTypes';
import ValueManager from './../ValueManager';
import ObjectType from './../types/Object.jsx';
import _set from 'lodash/object/set';
import {noop} from './../tutils';
import warning from '../warning';
import loader from '../loader';
import injector from '../injector';

export default class Form extends Component {
    static  childContextTypes = PropTypes.contextTypes;

    static propTypes = {
        schema: PropTypes.schema.isRequired,
        loader: PropTypes.loader,
        injector: PropTypes.injector,
        valueManager: PropTypes.valueManager,
        template: PropTypes.template,
        method: PropTypes.string,
        action: PropTypes.string,
        enctype: PropTypes.string,
        onSubmit: PropTypes.event,
        noValidate: PropTypes.bool
    };

    static defaultProps = {
        template: 'FormTemplate',
        onSubmit: noop,
        noValidate: false
    };

    getChildContext() {
        return {
            valueManager: this.valueManager, loader: this.loader, injector: this.injector
        };
    }

    constructor(props, context, whatever) {
        super(props, context, whatever);
        this.loader = props.loader || loader;
        this.injector = props.injector || injector;
        if (!props.valueManager) {
            this.valueManager = ValueManager(this.props.value, this.props.errors);
        } else {
            this.valueManager = props.valueManager;
            if (props.value) {
                this.valueManager.setValue(this.props.value);
            }
            if (this.props.errors) {
                this.valueManager.setErrors(this.props.errors);
            }
        }
        this.ObjectWrapper = this.injector.inject(ObjectType);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.loader !== this.props.loader) {
            this.loader = newProps.loader;
        }
        if (newProps.valueManager !== this.props.valueManager) {
            this.valueManager = newProps.valueManager;
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
    }

    getValue() {
        return this.valueManager.getValue();
    }

    handleSubmit = (e)=> {
        e && e.preventDefault();
        var vm = this.valueManager;
        if (!this.props.noValidate) {
            vm.validate();
        }
        if (vm.onSubmit(e, vm.getErrors(), vm.getValue(), this.props.path) !== false) {
            this.props.onSubmit(e, vm.getErrors(), vm.getValue());
        }
    };

    setErrors = (errors)=> {
        this.valueManager.setErrors(errors);
    };


    render() {

        var {valueManager, injector, loader, template, onSubmit, ...props} = this.props;
        const ObjectWrapper = this.ObjectWrapper;
        return <ObjectWrapper ref="form" {...props} objectTemplate={template} onSubmit={this.handleSubmit}/>
    }

}
