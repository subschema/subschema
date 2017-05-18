import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {Form, loader, ValueManager, compileStyle} from 'subschema-native';
import _examples from './examples';
import Example from './types/Example';
import ExampleItemTemplate from './templates/ExampleItemTemplate';
import JSONView from './types/JSONView';
import styles from './styles';

const examples = Object.keys(_examples).map((id) => ({id, example: _examples[id]}));

loader.addTypes({JSONView, Example});
loader.addTemplate({ExampleItemTemplate});
loader.addStyles(styles);

const schema = {
    schema: {
        "examples": {
            type: "List",
            template: false,
            title: false,
            itemType: 'Example',
            editTemplate: {
                template: 'ModalTemplate',
                CloseButton: {
                    template: 'ButtonTemplate',
                    label: '< Back',
                    buttonClass: 'ModalTemplate.backBtn',
                    action: 'cancel'
                }
            },
            canEdit: true,
            itemTemplate: "ExampleItemTemplate",
            contentTemplate: false,
            buttons: {buttons: []}
        }
    },
    fieldsets: [{fields: ["examples"]}]
};
const valueManager = ValueManager({examples});
export default  () => <Form schema={schema} valueManager={valueManager} loader={loader}/>
