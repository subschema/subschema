"use strict";

import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import UninjectedConditional from './Conditional.jsx';
export default class Field extends Component {

    static contextTypes = {
        injector: PropTypes.injector
    };

    static propTypes = {
        path: PropTypes.path.isRequired,
        field: PropTypes.field,
        Conditional: PropTypes.injectClass
    };
    static defaultProps = {
        Conditional: UninjectedConditional
    };

    renderField(field, propPath) {
        const {Template, Type,   path, ...rest} = field;
        const validators = field.validators;
        const cpath = propPath || path;
        const FieldTemplate = Template;
        return (FieldTemplate ? <FieldTemplate path={cpath}  {...rest} >
            <Type path={cpath} onBlur={validators} {...rest}/>
        </FieldTemplate> : <Type path={cpath} {...rest}/>);

    }

    renderConditional(conditional) {
        const {Conditional, field, path} = this.props;
        if (!conditional) {
            return this.renderField(field, path);
        }
        return <Conditional path={path} {...conditional} field={field}>{this.renderField(field, conditional.path || path)}</Conditional>
    }

    render() {
        return this.renderConditional(this.props.field.conditional);
    }
}
