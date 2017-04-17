"use strict";

import React, {Component} from "react";
import PropTypes from "../PropTypes";

export default class Checkbox extends Component {

    static inputClassName = ' ';

    static propTypes = {
        onChange: PropTypes.valueEvent,
        checkedClass: PropTypes.cssClass,
        onValidate: PropTypes.changeValidate
    };

    static defaultProps = {
        type: 'checkbox',
        checkedClass: ''
    };


    handleChange =(e)=> {
        const {value} = this.props;

        //Blur does not get called on checkbox, so we do check on change anyways.
        const val = e.target.checked ? !value ? true : value : !value ? false : null;
        this.props.onChange(val);
    };

    render() {
        const {onChange, onValidate, value, className, checkedClass, ...props} = this.props;

        const checked = typeof value === 'boolean' ? value : value == null || value === '' ? this.props.checked : true;
        return <input {...props} value={value == null ? '' : value}
                                 className={className+' '+(checked ? checkedClass : '')}
                                 checked={checked == null ? false : checked } onChange={this.handleChange}/>
    }
}
