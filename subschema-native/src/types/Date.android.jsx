import React, {Component} from "react";
import PropTypes from "subschema-prop-types";

import {DatePickerAndroid, StyleSheet} from "react-native";
const dateType = PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]);
export default class DateInputType extends Component {
    static propTypes = {
        minDate: dateType,
        maxDate: dateType,
        mode: PropTypes.oneOf(['calendar', 'spinner', 'default']),
        onChange: PropTypes.valueEvent,
        onError: PropTypes.errorEvent
    };
    static defaultProps = {
        ...DatePickerAndroid.defaultProps
    };


    showPicker = (event, stateKey = 'simple', options = {}) => {

        const newState = {};
        DatePickerAndroid.open({
            date: asDate(this.props.value),
            minDate: this.props.minDate,
            maxDate: this.props.maxDate,
            mode: this.props.mode
        }).then(({action, year, month, day}) => {
            try {
                if (action === DatePickerAndroid.dismissedAction) {
                    newState[stateKey + 'Text'] = 'dismissed';
                } else {
                    const date = new Date(year, month, day);

                    this.props.onChange(date);
                }
                this.setState(newState);
            } catch (e) {
                const {code, message} = e;
                this.props.onError(e);
            }
        });
    };

    asDate(value) {
        if (value == null) return new Date();
        if (value instanceof Date) {
            return value;
        }
        return new Date(value);
    }

    render() {
        const date = asDate(this.props.value);
        return <TouchableWithoutFeedback
            onPress={this.showPicker}>
            <Text style={styles.text}>{date + ''}</Text>
        </TouchableWithoutFeedback>
    }

}

var styles = StyleSheet.create({
    text: {
        color: 'black'
    }
});

