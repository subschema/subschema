"use strict";

import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import _Conditional from './Conditional.jsx';
export default class Field extends Component {

    static contextTypes = {
        injector: PropTypes.injector
    };

    static propTypes = {
        path: PropTypes.path.isRequired,
        field: PropTypes.field
    };

    constructor(props, context, ...rest) {
        super(props, context, ...rest);
        this.Conditional = context.injector.inject(_Conditional);

    }

    renderField(field) {
        const {Template, Type, validators,  conditional, path, ...rest} = field;
        const cpath = (conditional && conditional.path) ? conditional.path : this.props.path;
        return (Template ? <Template path={cpath} {...rest} >
            <Type path={cpath} onBlur={validators} {...rest}/>
        </Template> : <Type path={cpath} {...rest}/>);

    }

    renderConditional(conditional) {
        if (!conditional) {
            return this.renderField(this.props.field);
        }
        const Conditional = this.Conditional;
        return <Conditional path={this.props.path} {...conditional}>{this.renderField(this.props.field)}</Conditional>
    }

    render() {
        const {type, path, field} =this.props;
        return this.renderConditional(field.conditional);
    }
}
