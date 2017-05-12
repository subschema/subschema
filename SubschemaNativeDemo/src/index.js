import React, {Component} from 'react';
import {Form} from 'subschema-native';
import schema from './schema.js';
export default class SubschemaNativeDemo extends Component {
    render() {
        return (
            <Form schema={schema}
                  value={{email: 'hello@test.com', password: '123', lollipops: ["red", "green", "blueberry"]}}/>
        );
    }
}