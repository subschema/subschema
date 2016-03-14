"use strict";

import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import RenderTemplate from './RenderTemplate.jsx';
import {FREEZE_ARR} from '../tutils';

export default class Field extends Component {
    static displayName = "Field";

    static propTypes = {
        path: PropTypes.path.isRequired,
        field: PropTypes.field,
        transition: PropTypes.transition,
        conditional: PropTypes.conditional
    };


    renderField(field, propPath) {
        const { Type,   path,  template, ...rest} = field;
        const validators = field.validators || FREEZE_ARR;
        const cpath = propPath || path;
        return <RenderTemplate template={template} path={cpath}  {...rest} field={field}>
            <Type path={cpath} onBlur={validators} {...rest}/>
        </RenderTemplate>

    }

    renderConditional(conditional) {
        const {field, path} = this.props;

        if (!conditional) {
            return this.renderField(field, path);
        }

        const {Conditional, ...rest} = conditional;

        return <Conditional path={path} {...rest}
                            field={field}>{this.renderField(field, conditional.path || path)}</Conditional>
    }

    render() {
        if (this.props.transition) {
            const {Transition, ...transition} = this.props.transition;
            return (<Transition {...transition}>
                {this.renderConditional(this.props.conditional)}
            </Transition>);
        }
        return this.renderConditional(this.props.conditional);
    }
}
