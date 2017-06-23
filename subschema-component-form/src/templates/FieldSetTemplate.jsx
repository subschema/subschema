import React, { Component } from 'react';
import PropTypes from 'subschema-prop-types';
import { FREEZE_OBJ as field } from 'subschema-utils';

export default class FieldSetTemplate extends Component {
    static propTypes = {
        buttons  : PropTypes.renderedTemplate,
        legend   : PropTypes.node,
        className: PropTypes.cssClass,
        field    : PropTypes.any,
        content  : PropTypes.node
    };

    static defaultProps = {
        field
    };

    render() {
        const { legend, content, legendClass, buttons, className } = { ...this.props.field, ...this.props };
        return legend ? <fieldset className={className}>
            <legend className={legendClass}>{legend}</legend>
            {content}
            {this.props.children}
            {buttons}
        </fieldset> : <div className={className}>
                   {content}
                   {this.props.children}
                   {buttons}
               </div>
    }
}
