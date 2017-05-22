import React, {Component} from 'react';
import {Text, View, ClassSheet} from 'react-native';
import EditorTemplate from 'subschema-component-form/lib/templates/EditorTemplate';
import {style} from '../PropTypes';
const {propTypes, defaultProps} = EditorTemplate;

export default class EditorTemplateNative extends React.Component {
    static propTypes = EditorTemplate.propTypes;
    static defaultProps = EditorTemplate.defaultProps;

    render() {
        const {name, title, error, editorClass, labelClass, errorClass, help, errorClassName, message, fieldClass, children} = this.props;
        return (<View style={editorClass}>
            {title ? <Text style={labelClass}>{title}</Text> : null}
            {children}
            {error ? <Text style={errorClass}>{error}</Text> : null}
        </View>);
    }
}