import React, {Component} from 'react';
import {View, ViewPropTypes} from 'react-native';
import PropTypes from 'subschema-prop-types';
import {styleClass} from '../PropTypes';

export default class DisplayView extends Component {
    static propTypes = {
        ...ViewPropTypes.propTypes,
        style: PropTypes.style,
        className:styleClass
    };

    render() {
        const {className, style, children, ...props} = this.props;
        return <View {...props} style={className}>{children}</View>
    }

};