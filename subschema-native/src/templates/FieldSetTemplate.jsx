import React, {Component} from 'react';
import FieldSetTemplate from 'subschema-component-form/lib/templates/FieldSetTemplate';
import {View, Text} from 'react-native';

export default class FieldSetTemplateNative extends Component {
    static propTypes = FieldSetTemplate.propTypes;
    static defaultProps = FieldSetTemplate.defaultProps;

    render() {
        const {legend, children, content, legendClass, buttons, className, ...rest} =  {...this.props.field, ...this.props};
        return (<View style={className}>
            {legend ? <Text style={legendClass}>{legend}</Text> : null}
            {children}
            {buttons}
        </View> );
    }
}