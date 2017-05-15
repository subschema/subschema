import React, {Component} from 'react';
import {Form} from 'subschema-native';
import schema from './schema.js';
const value = {email: 'hello@test.com', password: '123', lollipops: ["red", "green", "blueberry"]};
export default () => <Form schema={schema} value={value}/>
