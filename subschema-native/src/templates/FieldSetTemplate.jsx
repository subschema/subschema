import React, {Component} from 'react';
import FieldSetTemplate from 'subschema-component-form/lib/templates/FieldSetTemplate';
import {View, Text} from 'react-native';

const {propTypes, defaultProps} = FieldSetTemplate;

export default class FieldSetTemplateNative extends Component {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        const {legend, content, legendClass, children, buttons, className, ...rest} =  {...this.props.field, ...this.props};
        return (<View>
            {legend ? <Text>{legend}</Text> : null}
            {children}
            {buttons}
        </View> );
    }
}