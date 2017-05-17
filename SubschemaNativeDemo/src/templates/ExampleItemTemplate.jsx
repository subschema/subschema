import React, {PureComponent} from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import PropTypes from 'subschema-prop-types';
import {styleClass} from 'subschema-native/lib/PropTypes';

export default class ExampleItemTemplate extends PureComponent {

    static propTypes = {
        nameClass: styleClass,
        descriptionClass: styleClass,
        containerClass: styleClass,
        value: PropTypes.any,
        pos: PropTypes.any,
        pid: PropTypes.any,
        onEdit: PropTypes.func
    };
    _handleClick = (...args) => {
        const {value} = this.props.value;
        this.props.onEdit(this.props.pos, value, this.props.pid);
    };

    render() {
        const {value: {value = {}}, containerClass, nameClass, descriptionClass} = this.props;
        const {example = {}} = value;
        return <TouchableHighlight onPress={this._handleClick} underlayColor="#ccc">
            <View style={containerClass}>
                <Text style={nameClass}>{example.name}</Text>
                <Text style={descriptionClass}>{example.description}</Text>
            </View>
        </TouchableHighlight>
    }
}