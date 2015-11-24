import React, {Component} from 'react';
import {returnFirst} from '../tutils';
export default class DateInput extends Component {

    static eventValue = returnFirst;

    static defaultProps = {
        type: "date"
    }

    asInputValue(value) {
        if (value == null) {
            return '';
        }
        return new Date(value).toISOString().substring(0, 10);
    }


    handleDateChange = (e)=> {
        var value = e.target.value
        this.props.onChange(new Date(value).getTime());
    }


    render() {
        var {value, onChange, ...props} = this.props;
        return <input {...props} onChange={this.handleDateChange} value={this.asInputValue(value)}  />
    }
}
