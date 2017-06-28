import React, { Component } from 'react';
import PropTypes from 'subschema-prop-types';
import { createValidator } from './resolvers/validate';
import renderTemplate from './RenderTemplate';

export default class Field extends Component {
    static displayName  = "Field";
    static contextTypes = {
        valueManager: PropTypes.valueManager,
        loader      : PropTypes.loader
    };
    static propTypes    = {
        path       : PropTypes.path.isRequired,
        field      : PropTypes.field,
        transition : PropTypes.transition,
        conditional: PropTypes.conditional
    };


    renderField(field, propPath) {
        const { Type, path, template, validators, ...rest } = field;
        const cpath                                         = propPath || path;
        rest.validators                                     =
            createValidator(validators, cpath, this.context);
        const children                                      = <Type
            path={cpath}  {...rest}/>
        return renderTemplate(
            { key: cpath, template, path: cpath, children, ...rest })
    }

    renderConditional(conditional) {
        const { field, path } = this.props;

        if (!conditional) {
            return this.renderField(field, path);
        }

        const { Conditional, ...rest } = conditional;

        return <Conditional path={path} {...rest}
                            field={field}>{this.renderField(field,
            conditional.path || path)}</Conditional>
    }

    render() {
        if (this.props.transition) {
            const { Transition, ...transition } = this.props.transition;
            return (<Transition {...transition}>
                {this.renderConditional(this.props.conditional)}
            </Transition>);
        }
        return this.renderConditional(this.props.conditional);
    }
}
