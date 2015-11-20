"use strict";
import React, {Component} from 'react';
import Constants from '..';
import {forField} from '../css';
import field from '../decorators/field';

@field
export default class TextArea extends Component {
    static inputClassName = Constants.inputClassName;
    render() {
        var {fieldAttrs, value, onBlur, onChange, onValueChange, ...props} = this.props;
        return <textarea onBlur={this.handleValidate}
                         onChange={this.handleChange}
                         id={this.props.name}
                         className={forField(this)}
                         value={this.state.value}

            {...props}
            {...fieldAttrs}
        />
    }
}