import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import {DatePickerIOS} from 'react-native';

export default class DateInputType extends Component {
    static propTypes = {
        onChange:PropTypes.valueEvent
    };
    render() {
        var date = this.props.value || new Date();
        return <DatePickerIOS
            date={date }
            mode="datetime"
            onDateChange={this.props.onChange}
        />
    }

}
