/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    SegmentedControlIOS,
} from 'react-native'

import {Form} from 'subschema-native';

const schema = {
    schema: {
        "email": {
            type: "Text",
            validators: ["required", "email"]
        },
        "password": {
            type: "Password",
            validators: ["required"]

        },
        "remember": {
            type: "Checkbox",
            title: "Remember Me?"
        },
        "lollipops": {
            "type": "List",
            "canEdit": true,
            "canAdd": true,
            "canReorder": true,
            "canDelete": true
        }
    },
    template: "WizardTemplate",
    fieldsets: [{legend: "Login", "fields": ["email", "password"]}, {
        legend: "Switch",
        fields: "remember"
    }, {
        legend: "List", fields: "lollipops",
        buttons: [{
            label: "Submit",
            primary: true
        }, "Cancel"]
    }]
}

export default class SubschemaNativeDemo extends Component {
    render() {
        return (
            <Form schema={schema} value={{email:'hello@test.com', password:'123', lollipops: ["red", "green", "blueberry"]}}/>
        );
    }
}
function Default({styles}) {
    return <View style={styles.container}>

        <Text style={styles.welcome}>
            Welcome to React Native IOS!
        </Text>
        <Text style={styles.instructions}>
            To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
            Press Cmd+R to reload,{'\n'}
            Cmd+D or shake for dev menu
        </Text>
    </View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});