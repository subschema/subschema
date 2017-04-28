import React, {Component} from "react";
import {Form} from "subschema-core";
import HistoryTypes from './PropTypes';

export default class NavigationForm extends Form {
    static propTypes = {
        ...Form.propTypes,
        history: HistoryTypes.history
    };
    static childContextTypes = {
        ...Form.childContextTypes,
        history: HistoryTypes.history
    };

    getChildContext() {
        return {
            valueManager: this.valueManager,
            loader: this.loader,
            injector: this.injector,
            validate: this.props.validate,
            noValidate: this.props.noValidate,
            history: this.props.history
        };
    }

    render() {
        const {history, ...rest} = this.props;
        return <Form {...rest}/>
    }
}