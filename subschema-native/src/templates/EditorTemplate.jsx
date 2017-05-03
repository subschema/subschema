import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import EditorTemplate from 'subschema-component-form/lib/templates/EditorTemplate';
const {propTypes, defaultProps} = EditorTemplate;

export default class EditorTemplateNative extends React.Component {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        var {name, title, error, help, errorClassName, message, fieldClass, children} = this.props;
        return (<View style={styles.editor}>
            {title ? <Text style={styles.label}>{title}</Text> : null}
            {children}
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>);
    }
}

var styles = StyleSheet.create({
    editor: {
        margin: 5,
        padding: 5,
        flex: 1
    },
    label: {
        fontWeight: '700',
        paddingTop: 12,
        marginBottom: 5
    },
    error: {
        color: '#c72e2e',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 12,
        paddingRight: 12,
    }
});

