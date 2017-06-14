import React, {Component} from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'subschema-prop-types';
import {styleClass} from '../PropTypes';

export default class RadioItemTemplate extends Component {
    static propTypes = {
        label: PropTypes.string,
        className: styleClass,
        textClass: styleClass
    };

    render() {
        const {label, className, textClass, children} = this.props;
        return <View
            style={className}>
            {children}
            <Text style={textClass}>{label}</Text>

        </View>
    }
}
