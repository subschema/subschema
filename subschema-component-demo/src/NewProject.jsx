import React, {Component} from 'react';
import {Form, loader} from 'subschema';
import PropTypes from 'subschema-prop-types';

const schema = {
    schema: {
        name: {
            type: 'Text',
            validators: ['required', 'npm_validate']
        },
        description: {
            type: 'TextArea',
            validators: ['required']
        },
        "buttons": {
            type: "UpdateValue",
            template: false
        }
    }
};
export default class NewProject extends Component {

    static contextTypes = {
        loader: PropTypes.loader
    };
    handleSubmit = (e) => {
        e && e.preventDefault();
    };

    render() {
        return <Form schema={schema} onSubmit={this.handleSubmit} valueManager={this.valueManager}
                     loader={this.context.loader}/>;

    }
}