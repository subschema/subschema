"use strict";

import React, {Component} from 'react';
import field from '../decorators/field';
import {forField} from '../css';

@field
export default class Password extends Component {
    render() {
        var {onBlur, onChange, onValueChange, value, fieldAttrs, ...props} =this.props;
        return <input id={this.props.name} onBlur={this.handleValidate} onChange={this.handleChange}
                      className={forField(this)} type="password"
                      value={this.state.value}
            {...props}
            {...fieldAttrs}
        />
    }

}