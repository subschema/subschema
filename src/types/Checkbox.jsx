"use strict";

import React, {Component} from 'react';
import PropTypes from '../PropTypes';

export default class Checkbox extends Component {

    static inputClassName = ' ';

    static propTypes = {
        onChange: PropTypes.valueEvent,
        checkedClass: PropTypes.cssClass,
        onBlur: PropTypes.changeValidate
    };

    static defaultProps = {
        type: 'checkbox',
        checkedClass: ''
    };


    handleChange(e) {
        const {value} = this.props;
        //Blur does not get called on checkbox, so we do check on change anyways.
        const val = e.target.checked ? value == null || value === false ? true : value : value == null || value == true ? false : null;
        this.props.onChange(val);
    };

    render() {
        const {onChange, value, className, checkedClass, ...props} = this.props;

        const checked = typeof value === 'boolean' ? value : value == null ? this.props.checked : true;
        return <input {...props} value={value} className={className+' '+(checked ? checkedClass : '')}
                                 checked={checked} onChange={this::this.handleChange}/>
    }
}
