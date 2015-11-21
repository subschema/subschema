import React, {Component} from 'react';
import {forField} from '../css';
import field from '../decorators/field';

@field(true)
export default class Checkbox extends Component {
    static inputClassName = ' ';
    constructor(props, ...rest) {
        super(props, ...rest);
    }

    handleChange(e) {
        var hasProp = 'value' in this.props;

        this.triggerChange(e.target.checked ? hasProp ? this.props.value : true : hasProp ? null : false);
    }

    render() {
        var {onValueChange, onChange,value, type, dataType, checkedClass, fieldAttrs, className, onBlur, ...props} = this.props;
        dataType = dataType || 'checkbox';
        var checked = false;
        if ('value' in this.props) {
            checked = this.state.value === value;
        } else {
            checked = this.state.value != null;
        }
        return <input onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={ (checked ? checkedClass || '' : '' )+' '+forField(this)}
                      value={value}
                      checked={checked}
                      type={dataType}
            {...props}
            {...fieldAttrs}
        />
    }
}
