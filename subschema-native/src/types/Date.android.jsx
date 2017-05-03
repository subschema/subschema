import React, {Component} from 'react';
import PropTypes from 'subschema-prop-types';

import {DatePickerAndroid, StyleSheet} from 'react-native';

export default class DateInputType extends Component {
    static propTypes = {
        onChange: PropTypes.valueEvent,
        onError: PropTypes.errorEvent
    };
    state = {
        simpleText: ''
    };

    showPicker = (event, stateKey = 'simple', options) => {

        const newState = {};
        DatePickerAndroid.open(options).then(({action, year, month, day})=> {
            try {
                if (action === DatePickerAndroid.dismissedAction) {
                    newState[stateKey + 'Text'] = 'dismissed';
                } else {
                    const date = new Date(year, month, day);
                    newState[stateKey + 'Text'] = date.toLocaleDateString();
                    newState[stateKey + 'Date'] = date;
                    this.props.onChange(date);
                }
                this.setState(newState);
            } catch (e) {
                const {code, message} = e;
                this.props.onError(e);
                console.warn(`Error in example '${stateKey}': `, message);
            }
        });
    };

    render() {
        var date = this.props.value || new Date();
        return <TouchableWithoutFeedback
            onPress={this.showPicker}>
            <Text style={styles.text}>{this.state.simpleText}</Text>
        </TouchableWithoutFeedback>
    }

}

var styles = StyleSheet.create({
    text: {
        color: 'black'
    }
});

