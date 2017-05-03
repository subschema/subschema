import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';
import {SwitchAndroid} from 'react-native';

export default class Checkbox extends Component {
    static propTypes = {
        onChange: PropTypes.valueEvent
    }

    changeValue() {
        var value = !this.state.value
        this.props.onChange(value ? true : false);
    }


    render() {
        return (
            <SwitchAndroid
                onValueChange={this.changeValue}
                value={this.props.value == null ? false : this.props.value}/>
        );
    }
}