"use strict";
import React, {Component} from 'react';
import {field} from '../decorators';
import Constants from '../Constants';
import css from '../css';

@field
export default class TextInput extends Component {
    static   inputClassName = Constants.inputClassName;

    render() {
        var {onChange, onValueChange, onBlur, className, field, value, dataType, value, fieldAttrs, type, ...props} = this.props
        return <input onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={this.props.className}

                      value={this.state.value}
            {...props} {...fieldAttrs}
                      type={dataType || 'text'}
        />
    }
}

