"use strict";
import React, {Component} from 'react';
import {Form, ValueManager, decorators, loader, loaderFactory, PropTypes} from 'Subschema';
import DownloadButton from './DownloadButton.jsx';


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
        return (
            <Form schema={schema} onSubmit={this.handleSubmit} valueManager={this.valueManager}
                  loader={this.context.loader}/>
        );

    }
}