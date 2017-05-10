import React from 'react';
import {TouchableHighlight, Text, View} from 'react-native';
import {ContentItemTemplate as DOMContentItemTemplate} from 'subschema-component-list';
import {style} from '../PropTypes';


export default class ContentItemTemplate extends DOMContentItemTemplate {
        render() {
        const {value, showKey, children, itemClass, innerItemClass, clickClass, labelKey} = this.props;
        const key = value.key || '';
        const _label = labelKey ? _get(value.value, labelKey, '') : value.value;
        return (<TouchableHighlight onPress={this.handleClick} style={this.props.clickClass}>
            <View>
            {showKey ? <Text style={this.props.itemClass}>{key}</Text> : null}
            <Text style={this.props.innerItemClass}>{_label}</Text>
            {children}
            </View>
        </TouchableHighlight>);
    }
}
