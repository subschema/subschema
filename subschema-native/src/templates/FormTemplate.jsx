import React, {Component} from 'react';
import {View} from 'react-native';
import FormTemplate from 'subschema-component-form/lib/templates/FormTemplate';
import {styleClass} from '../PropTypes';

const {propTypes, defaultProps} = FormTemplate;

export default class FormTemplateNative extends Component {
    static propTypes = {
        ...propTypes,
        className: styleClass,
        formClass: styleClass
    };
    static defaultProps = {
        ...defaultProps,
        className: 'style'
    };
    static displayName = 'FormTemplate';

    render() {
        const {children, style, fieldAttrs, formClass, className, ...props} = this.props;

        return <View style={className || formClass} {...props}>
            {children}
        </View>
    }
}