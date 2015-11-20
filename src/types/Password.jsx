"use strict";

import React, {Component} from 'react';
import field from '../decorators/field';
import Constants from '../Constants';

@field
export default class Password extends Component {
    static inputClassName = Constants.inputClassName

    render(){
        var {onBlur, onChange, onValueChange, value, fieldAttrs, ...props} =this.props;
        return <input id={this.props.name} onBlur={this.handleValidate} onChange={this.handleChange}
                      className={css.forField(this)} type="password"
                      value={this.state.value}
            {...props}
            {...fieldAttrs}
            />
    }

}