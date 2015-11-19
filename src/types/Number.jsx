"use strict";
import React, {Component} from 'react';
import Constants from '../Constants';
import css from '../css';
import field from '../decorators/field';

var noRe = /^(-|\+)?([0-9]*\.)?$/, numRe = /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/;

@field
export default class NumberInput extends Component {
    static inputClassName = Constants.inputClassName

    handleDateChange(e) {

        var value = e.target.value;
        //Not a valid number but valid to become a number
        if (value === '') {
            this.triggerChange(null);
        } else if (noRe.test(value)) {
            if (/\.$/.test(value)) {
                this.triggerChange(parseFloat(value))
                this.setValue(value);
            } else {
                this.setValue(value);
            }
        } else
        //check if real actual numbers.
        if (numRe.test(value)) {
            this.triggerChange(parseFloat(value))
        } else {
            this.setState({value: this.state.value || ''});
            this.forceUpdate();
            return false;
        }
    }

    render() {
        var {onChange, onValueChange, onBlur, className, field, value, dataType, value, fieldAttrs, type, ...props} = this.props
        return <input ref="input" onBlur={this.handleValidate} onChange={this.handleDateChange} id={this.props.name}
                      className={css.forField(this)}

                      value={this.state.value}
            {...props} {...fieldAttrs}
                      type={dataType || 'text'}
        />
    }
}