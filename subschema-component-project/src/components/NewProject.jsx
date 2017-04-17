"use strict";
import React, {Component} from 'react';
import {Form, ValueManager, decorators, loader, loaderFactory, PropTypes} from 'Subschema';
import DownloadButton from './DownloadButton.jsx';
import samples from '../samples';
import camelCase from 'lodash/string/camelCase';
import kebabCase from 'lodash/string/kebabCase';
import capitalize from 'lodash/string/capitalize';
import validateNpmPkgName from 'validate-npm-package-name'

const {Basic} = samples;

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

const projectLoader = loaderFactory([loader]);
projectLoader.addValidator({
    npm_validate(options) {
        options = options || {};
        if (!options.message) {
            options.message = "Invalid Package Name"
        }
        if (!options.validType) {
            options.validType = 'validForNewPackages'
        }
        return function package_name$validator(value) {
            if (!validateNpmPkgName(value)[options.validType]) {
                return {
                    message: options.message
                }
            }
        }
    }
});

projectLoader.addType({UpdateValue});


export default class NewProject extends Component {


    handleSubmit = (e) => {
        e && e.preventDefault();
    };

    render() {
        return (
            <Form schema={schema} onSubmit={this.handleSubmit} valueManager={this.valueManager} loader={projectLoader}/>
        );

    }
}