"use strict";
import React, {Component} from 'react';
import PropTypes from '../PropTypes';

var noRe = /^(-|\+)?([0-9]*\.)?$/, numRe = /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/;


export default class NumberInput extends Component {

    static propTypes = {
        onChange: PropTypes.valueEvent
    };

    constructor(props, ...rest) {
        super(props, ...rest);
        var state = this.state || (this.state = {});
        state.value = props.value;

    }

    componentWillReceiveProps(newProps) {
        if (newProps.value !== this.props.value) {
            this.setState({value: newProps.value});
        }
    }

    handleDateChange = (e)=> {

        var value = e.target.value;
        //Not a valid number but valid to become a number
        if (value === '') {
            this.props.onChange(null);
        } else if (noRe.test(value)) {
            if (/\.$/.test(value)) {
                this.props.onChange(parseFloat(value))
                this.setValue(value);
            } else {
                this.setValue(value);
            }
        } else
        //check if real actual numbers.
        if (numRe.test(value)) {
            this.props.onChange(parseFloat(value))
        } else {
            this.forceUpdate();
            return false;
        }
    };

    render() {
        var {onChange, value, ...props} = this.props
        return <input {...props} value={this.state.value} onChange={this.handleDateChange}/>
    }
}