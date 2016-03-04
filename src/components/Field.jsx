"use strict";

import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import {FREEZE_ARR} from '../tutils';
import ReactCSSReplaceTransition from '../transition/ReactCSSReplaceTransition.jsx';

export default class Field extends Component {
    static displayName = "Field";

    static contextTypes = {
        injector: PropTypes.injector
    };

    static propTypes = {
        path: PropTypes.path.isRequired,
        field: PropTypes.field,
        transition: PropTypes.transition,
        conditional: PropTypes.conditional
    };


    renderField(field, propPath) {
        const {Template, Type,   path, ...rest} = field;
        const validators = field.validators || FREEZE_ARR;
        const cpath = propPath || path;
        const FieldTemplate = Template;
        return (FieldTemplate ? <FieldTemplate path={cpath}  {...rest} >
            <Type path={cpath} onBlur={validators} {...rest}/>
        </FieldTemplate> : <Type path={cpath} {...rest}/>);

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
            return (<ReactCSSReplaceTransition {...this.props.transition}>
                {this.renderConditional(this.props.conditional)}
            </ReactCSSReplaceTransition>);
        }
        return this.renderConditional(this.props.conditional);
    }
}
