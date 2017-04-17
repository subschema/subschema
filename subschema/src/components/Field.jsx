"use strict";

import React, {Component} from "react";
import PropTypes from "../PropTypes";
import RenderTemplate from "./RenderTemplate";
import {createValidator} from '../resolvers/validate';

export default class Field extends Component {
    static displayName = "Field";
    static contextTypes = {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader
    };
    static propTypes = {
        path: PropTypes.path.isRequired,
        field: PropTypes.field,
        transition: PropTypes.transition,
        conditional: PropTypes.conditional
    };


    renderField(field, propPath) {
        const {Type, path, template, validators, ...rest} = field;
        const cpath = propPath || path;
        rest.validators = createValidator(validators, cpath, this.context);
        return <RenderTemplate key={cpath} template={template} path={cpath}  {...rest}>
            <Type path={cpath}  {...rest}/>
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
