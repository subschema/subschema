"use strict";
import React, {Component} from "react";
import PropTypes from "subschema-prop-types";
import camelCase from "lodash/camelCase";
import capitalize from "lodash/capitalize";
import DownloadButton from "./DownloadButton.jsx";

export default class UpdateValue extends Component {
    static contextTypes = {
        loader: PropTypes.loader
    };
    static propTypes = {
        filename: PropTypes.value,
        description: PropTypes.value,


    };

    static defaultProps = {
        filename: "name",
        description: "description",
        sample: 'Basic'
    };

    name(name) {
        name = name || 'sample';
        this.setState({
            jsName: camelCase(filename),
            filename: `${filename}`,
            name: name, title: capitalize(filename.replace('-', ' '))
        });
    }

    description(description) {
        this.setState({
            description
        });
    }

    render() {
        let {filename, description, sample} = this.props;
        filename = filename || 'simple';

        sample = this.context.loader.loadSample(sample);
        const data = {
            jsName: camelCase(filename),
            name: filename,
            title: capitalize(filename.replace('-', ' ')),
            sample
        };

        return (<div className="btn-group">
            <DownloadButton filename={filename} data={data} type='project' key="project"/>
            <DownloadButton filename={filename} data={data} type='page' key="page" buttonTxtPage="Preview"/>
        </div>);
    }
}
