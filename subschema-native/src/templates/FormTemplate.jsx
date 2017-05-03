import React, {Component} from 'react';
import {View} from 'react-native';
import FormTemplate from 'subschema-component-form/lib/templates/FormTemplate';

const {propTypes, defaultProps} = FormTemplate;

export default class FormTemplateNative extends Component {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        var {children, style, ...props} = this.props;
        return <View style={style}>
            {children}
        </View>
    }
}