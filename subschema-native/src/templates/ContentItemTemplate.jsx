import React from 'react';
import {TouchableHighlight, Text, View} from 'react-native';
import {ContentItemTemplate as DOMContentItemTemplate} from 'subschema-component-list';
import {styleClass} from '../PropTypes';
import RPropTypes from 'prop-types';

export default class ContentItemTemplate extends DOMContentItemTemplate {
    static propTypes = {
        ...DOMContentItemTemplate.propTypes,
        itemClass: styleClass,
        keyClass: styleClass,
        innerItemClass: styleClass,
        underlayColor: RPropTypes.any
    };
    static defaultProps = {
        ...DOMContentItemTemplate.defaultProps,
        underlayColor: '#ccc'
    };

    render() {
        const {value, underlayColor, showKey, children, itemClass, innerItemClass, clickClass, labelKey} = this.props;
        const key = value.key || '';
        const _label = labelKey ? _get(value.value, labelKey, '') : value.value;
        return (
            <TouchableHighlight underlayColor={underlayColor} onPress={this.handleClick} style={this.props.itemClass}>
                <View>
                    {showKey ? <Text style={this.props.keyClass}>{key}</Text> : null}
                    <Text style={this.props.innerItemClass}>{_label}</Text>
                    {children}
                </View>
            </TouchableHighlight>);
    }
}
