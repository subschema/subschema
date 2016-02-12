"use strict";

import React, {Component} from 'react';
import PropTypes from  '../PropTypes';
import {FREEZE_OBJ, noop} from '../tutils';

export default class FieldSetTemplate extends Component {
    static propTypes = {
        buttons: PropTypes.buttons,
        legend: PropTypes.node,
        className: PropTypes.cssClass,
        //      onButtonClick: PropTypes.event,
        //      onClick: PropTypes.event,
        field: PropTypes.any,
        //       buttonsTemplate: PropTypes.template
    };
    static defaultProps = {
        field: FREEZE_OBJ
    };

    render() {
        var {legend, buttons, className, ...rest} =  {...this.props.field, ...this.props};
        return legend ?
            <fieldset className={className}>
                <legend>{legend}</legend>
                {this.props.children}
            </fieldset> :
            <div className={className}>
                {this.props.children}
            </div>
    }
}