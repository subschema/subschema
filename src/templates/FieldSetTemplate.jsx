"use strict";

import React, {Component} from 'react';
import PropTypes from  '../PropTypes';
import {FREEZE_OBJ as field} from '../tutils';

export default class FieldSetTemplate extends Component {
    static propTypes = {
        buttons: PropTypes.node,
        legend: PropTypes.node,
        className: PropTypes.cssClass,
        field: PropTypes.any,
        content: PropTypes.node
    };

    static defaultProps = {
        field
    };

    render() {
        const {legend, content, legendClass, buttons, className, ...rest} =  {...this.props.field, ...this.props};
        return legend ?
            <fieldset className={className}>
                <legend className={legendClass}>{legend}</legend>
                {content}
                {this.props.children}
                {buttons}
            </fieldset> :
            <div className={className}>
                {content}
                {this.props.children}
                {buttons}
            </div>
    }
}