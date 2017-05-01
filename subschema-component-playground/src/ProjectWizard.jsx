import 'subschema-component-playground/lib/global-fix';
import React, {Component} from 'react';
import ValueManager from 'subschema-valuemanager';
import {Form} from 'subschema';
import samples from 'subschema-test-samples';
import kebabCase from 'lodash/kebabCase';
import {saveAs} from 'browser-filesaver';

//A simple Schema for this configuration
export const schema = {
    schema: {
        samples: {
            type: 'Select',
            options: Object.keys(samples),
            placeholder: 'Custom Project'
        },
        jsName: {
            type: "Text",
            title: 'JavaScript Variable Name',
            help: 'A javascript friendly version of your project name'
        },
        userOrOrg: {
            type: "Text",
            title: "Username or organization",
            help: "Username or organization to publish module"
        },
        project: {
            type: 'Object',
            subSchema: {
                schema: {
                    name: {
                        type: 'Text',
                        help: "NPM package name"
                    },
                    version: {
                        type: 'Text',
                        help: "NPM package version"
                    },
                    repository: {
                        type: 'Text',
                        defaultValue: "https://github.com/{userOrOrg}/{project.name}"
                    },
                    "publishConfig": {
                        type: 'Object',
                        subSchema: {
                            "registry": {
                                type: "Text",
                                defaultValue: "https://registry.npmjs.org"
                            }

                        }
                    }
                }
            }
        },
        downloadBtn: {
            type: "ExportButtons",
            template: false
        }
    },
    "template": "WizardTemplate",
    "fieldsets": [{
        legend: "Choose a base sample",
        fields: "samples,userOrOrg"
    }, {
        legend: "Project",
        fields: "project"
    }, {
        legend: "Download",
        fields: "downloadBtn",
        buttons: [{
            action: "previous",
            label: "Previous"
        }]
    }]
};

var valueManager = ValueManager({
    samples: 'Basic'
});


valueManager.addListener('samples', function (value) {
    var sample = samples[value];
    if (!sample) {
        sample = {
            schema: {},
            setupTxt: '',
            props: null,
            data: {},
            errors: {},
            description: ''
        }
    }
    var {...copy} = sample;

    this.update('sample', null);
    this.update('jsName', value);
    this.update('project.name', 'example-' + kebabCase(copy.name || value));
    this.update('project.description', copy.description);
    this.update('project.version', '1.0.0');
    Object.keys(copy).forEach(k => this.update(`sample.${k}`, copy[k]));

}, valueManager, true);

export default class App extends Component {
    static defaultProps = {
        saveAs: saveAs
    };

    render() {
        return <div>
            <h3>Subschema Project Setup</h3>
            <Form schema={schema} valueManager={valueManager} loader={this.props.loader}/>
        </div>
    }
}
