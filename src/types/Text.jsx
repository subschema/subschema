"use strict";
import React, {Component} from 'react';
import {field} from '../decorators';
import {forField} from '../css';

@field
export default class TextInput extends Component {

    render() {
        var {onChange, onValueChange, onBlur, className, field, value, dataType, value, fieldAttrs, type, ...props} = this.props
        return <input onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={forField(this)}

                      value={this.state.value}
            {...props} {...fieldAttrs}
                      type={dataType || 'text'}
        />
    }
}

