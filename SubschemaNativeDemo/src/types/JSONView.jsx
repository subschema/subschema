import React, {Component} from "react";
import {View, Text} from "react-native";
import PropTypes from "subschema-prop-types";
import {styleClass} from "subschema-native/lib/PropTypes";
import SyntaxHighlighter from "react-native-syntax-highlighter";
import {docco} from "react-syntax-highlighter/dist/styles";

export default class JSONView extends Component {
    static propTypes = {
        label: PropTypes.string,
        value: PropTypes.value,
        headerClass: styleClass,
        jsonClass: styleClass,
        containerClass: styleClass
    };

    render() {
        const {value = {}, label = "", containerClass, jsonClass, headerClass} = this.props;
        return <View style={containerClass}>
            <Text style={headerClass}>{label}:</Text>
            <SyntaxHighlighter language='json' style={docco}>
                {JSON.stringify(value, null, 2)}
            </SyntaxHighlighter>
        </View>
    };
}
