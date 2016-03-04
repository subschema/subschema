"use strict";

import React, {Component} from 'react';
import PropTypes from './../PropTypes';
import ValueManager from './../ValueManager';

export default class NewChildContext extends Component {
    static displayName = "NewChildContext";
    static propTypes = {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader,
        path: PropTypes.string.isRequired
    };
    static childContextTypes = {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader,
        parentValueManager: PropTypes.valueManager
    };

    constructor(props, context, ...rest) {
        super(props, context, ...rest);
        var parentValueManager = this.props.valueManager;
        this.valueManager = ValueManager(parentValueManager.getValue(), parentValueManager.getErrors());
    }

    getChildContext() {
        return {
            valueManager: this.valueManager,
            parentValueManager: this.props.valueManager,
            loader: this.props.loader
        };
    }

    handleSubmit = (e)=> {
        //t(e, vm.getErrors(), vm.getValue(), this.props.path)
        var value = this.valueManager.path(this.props.path), errors = this.valueManager.getErrors();

        if (this.props.onSubmit) {
            if (this.props.onSubmit(e, errors, value, this.props.path) !== false) {
                this.props.valueManager.update(this.props.path, value);
            }
        } else {
            this.props.valueManager.update(this.props.path, value);
        }
        return false;
    };


    render() {
        return React.cloneElement(this.props.children, {onSubmit: this.handleSubmit});
    }
}
