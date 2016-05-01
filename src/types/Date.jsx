import React, {Component} from 'react';
import PropTypes from '../PropTypes';

export default class DateInput extends Component {

    static propTypes = {
        onChange: PropTypes.valueEvent
    };

    static defaultProps = {
        type: "date"
    };

    asInputValue(value) {
        if (!value) {
            return '';
        }
        return new Date(value).toISOString().substring(0, 10);
    }


    handleDateChange = (e)=> {
        var value = e.target.value;
        this.props.onChange(new Date(value).getTime());
    };


    render() {
        var {value, onChange, ...props} = this.props;
        return <input {...props} onChange={this.handleDateChange} value={this.asInputValue(value)}/>
    }
}
