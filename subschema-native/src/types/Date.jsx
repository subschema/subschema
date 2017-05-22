import React, {PureComponent} from "react";
import {Text, TouchableHighlight, View} from "react-native";
import PropTypes from "subschema-prop-types";
import DatePicker from "react-native-modal-datetime-picker";
import {styleClass} from "../PropTypes";
import moment from "moment";

const {onConfirm, onCancel, ...propTypes} = DatePicker.propTypes;

export default class DateInputType extends PureComponent {
    static displayName = 'Date';

    static propTypes = {
        ...propTypes,
        onChange: PropTypes.valueEvent,
        containerStyle: styleClass,
        mode: PropTypes.oneOf(["date", "datetime", "time"])

    };
    static defaultProps = {
        ...DatePicker.defaultProps,
        mode: 'date',
        setDateText: "Set Date",
        cancelTextIOS: "Cancel",
        confirmTextIOS: "Confirm",
        format: "dddd, MMMM Do YYYY, h:mm:ss a"
    };
    state = {
        visible: false
    };

    valueAsDate(value) {
        if (value == null) {
            this._date = new Date();
        } else if (this.props.value instanceof Date) {
            return this._date = value;
        } else {
            this._date = new Date(value)
        }
        return this._date;

    }


    handleDateChange = (date) => {
        this.props.onChange(date);
        this.hide();
    };
    hide = () => {
        this.setState({visible: false});
    };

    format(value) {
        if (!value) return this.props.setDateText;
        return moment(value).format(this.props.format);
    }

    handlePress = () => {
        this.setState({visible: true});

    };

    render() {
        const {onDateChange, containerClass, valueStyle, valueTextStyle, value, onChange, ...props} = this.props;
        return <View style={containerClass}>
            <TouchableHighlight style={valueStyle} onPress={this.handlePress}>
                <Text style={valueTextStyle}>{this.format(this.props.value)}</Text>
            </TouchableHighlight>
            <DatePicker
                {...props}
                isVisible={this.state.visible}
                onConfirm={this.handleDateChange}
                onCancel={this.hide}
                date={this.valueAsDate()}
            />
        </View>
    }

}
