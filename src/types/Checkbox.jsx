"use strict";

import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import {returnFirst} from '../tutils';

export default class Checkbox extends Component {

    static inputClassName = ' ';

    static propTypes = {
        onChange:PropTypes.valueEvent,
        checkedClass: PropTypes.cssClass
    };

    static defaultProps = {
        type: 'checkbox',
        checkedClass: ''
    };


    handleChange = (e)=> {
        var {value} = this.props;
        this.props.onChange(e.target.checked ? value == null || value === false ? true : value : value == null || value == true ? false : null);
    };

    render() {
        var {onChange, value, className, checkedClass, ...props} = this.props;

        var checked = typeof value === 'boolean' ? value : value == null ? this.props.checked : true;
        return <input {...props} value={value} className={className+' '+(checked ? checkedClass : '')}
                                 checked={checked} onChange={this.handleChange}/>
    }
}
