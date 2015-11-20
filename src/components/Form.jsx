"use strict";

import React, {Component} from 'react';
import PropTypes from './../PropTypes';
import ValueManager from './../ValueManager';
import ObjectType from './../types/Object.jsx';
import _set from '../../node_modules/lodash/object/set';
import {noop} from './../tutils';

export default class Form extends Component {
    static  childContextTypes = PropTypes.contextTypes;

    static propTypes = {
        schema: PropTypes.schema.isRequired,
        loader: PropTypes.loader,
        valueManager: PropTypes.valueManager,
        template: PropTypes.template,
        method: PropTypes.string,
        action: PropTypes.string,
        enctype: PropTypes.string,
        onSubmit: PropTypes.event,
        noValidate: PropTypes.bool
    }

    static defaultProps = {
        template: 'FormTemplate',
        onSubmit: noop,
        noValidate: false
    }

    getChildContext() {
        return {
            valueManager: this.valueManager, loader: this.loader
        };
    }

    constructor(props, context, whatever) {
        super(props, context, whatever);
        this.loader = props.loader || require('./../loader.js');
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

    }

    componentWillReceiveProps(newProps) {
        if (newProps.loader && newProps.loader !== this.loader) {
            this.loader = newProps.loader;
        }
        if (newProps.valueManager && newProps.valueManager !== this.valueManager) {
            this.valueManager = newProps.valueManager;
        }

        if (this.props.value !== newProps.value) {
            this.valueManager.setValue(newProps.value);
        }
        if (this.props.errors !== newProps.errors) {
            this.valueManager.setErrors(newProps.errors);
        }
    }

    getValue() {
        return this.valueManager.getValue();
    }

    handleSubmit = (e)=> {
        e && e.preventDefault();
        var vm = this.valueManager;
        if (!this.props.novalidate) {
            vm.validate();
        }
        if (vm.onSubmit(e, vm.getErrors(), vm.getValue(), this.props.path) !== false) {
            this.props.onSubmit(e, vm.getErrors(), vm.getValue());
        }
    }

    setErrors = (errors)=> {
        this.valueManager.setErrors(errors);
    }

    render() {

        var {valueManager, onSubmit, loader, ...props} = this.props;
        return <ObjectType {...props} onSubmit={this.handleSubmit}/>
    }

}
