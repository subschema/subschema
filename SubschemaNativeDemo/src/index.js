import React, {Component} from 'react';
import {Form, loader} from 'subschema-native';
import schema from './schema.js';

import {Text} from 'react-native';
import PropTypes from 'subschema-prop-types';
class JSONView extends Component {
    static propTypes = {
        value: PropTypes.value
    };

    render() {
        return <Text style={
            {
                margin: 10,
                padding: 10
            }
        }>{JSON.stringify(this.props.value, null, 2)}</Text>
    };
}

loader.addTemplate({
    JSONView
});
const def = {email: 'hello@test.com', password: '123', lollipops: ["red", "green", "blueberry"]};
export default () => <Form schema={schema} value={def}/>
