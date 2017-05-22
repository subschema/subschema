import React, {Component} from 'react';
import {View, ScrollView, Text} from 'react-native';
import PropTypes from 'subschema-prop-types';
import {styleClass} from 'subschema-native/lib/PropTypes';
import {Form, RenderTemplate, ValueManager} from 'subschema-native';

import JSONView from './JSONView';

export default class Example extends Component {
    static template = false;
    static propTypes = {
        value: PropTypes.value,
        useData: PropTypes.value,
        useErrors: PropTypes.value,
        onData: PropTypes.valueEvent,
        onErrors: PropTypes.valueEvent,
        containerClass: styleClass,
        headingClass: styleClass,
        formClass: styleClass,
        DataView: PropTypes.injectClass,
        buttonsTemplate: PropTypes.template,
        buttonClass: styleClass,
        buttonPressedClass: styleClass,
    };

    static defaultProps = {
        DataView: JSONView,
        useData: "useData",
        useErrors: "useErrors",
        onErrors: "useErrors",
        onData: "useData",
        buttonsTemplate: "ButtonsTemplate",
    };

    toggleData = () => {
        this.props.onData(!this.props.useData);
    };
    toggleErrors = () => {
        this.props.onErrors(!this.props.useErrors);
    };

    buttons() {
        return [{
            label: "Data",
            onClick: this.toggleData,
            buttonClass: this.props.useData ? this.props.buttonPressedClass : null
        }, {
            label: "Errors",
            onClick: this.toggleErrors,
            buttonClass: this.props.useErrors ? this.props.buttonPressedClass : null
        }];
    }

    componentWillMount() {
        this._setupValueManager(this.props);
    };

    _setupValueManager({useData = false, useErrors = false, value = {}}) {
        const {example} = value;
        if (!this._valueManager)
            this._valueManager = ValueManager();
        if (useData) {
            this._valueManager.setValue(example.value);
        } else {
            this._valueManager.setValue({});
        }
        if (useErrors) {
            this._valueManager.setErrors(example.errors);
        } else {
            this._valueManager.setErrors({});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value.id !== this.props.value.id || nextProps.useData !== this.props.useData || nextProps.useErrors !== this.props.useErrors) {
            this._setupValueManager(nextProps);
        }
    }

    render() {
        const {DataView, buttonsTemplate, formClass, value = {}, containerClass, headingClass} = this.props;
        const {example = {}} = value;
        return (<View style={containerClass}>
            <Text key="txt-name" style={headingClass}>{example.name}</Text>
            <View key="view-form" style={formClass}>
                <Form key="example-form" schema={example.schema} valueManager={this._valueManager}>
                    <DataView path={null} label="Value"/>
                </Form>
            </View>
            <RenderTemplate template={buttonsTemplate} buttons={this.buttons()}/>
            <JSONView key="schema-view" value={example.schema} label="Schema"/>
        </View>);
    }
}