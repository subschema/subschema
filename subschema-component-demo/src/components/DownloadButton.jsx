"use strict";
import React, {Component, PropTypes} from "react";
import {generate} from "subschema-project";
import {saveAs} from "browser-filesaver";
import camelCase from "lodash/string/camelCase";
import kebabCase from "lodash/string/kebabCase";

function openBlob(blob, handleDone) {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob);
        handleDone && handleDone();
    } else {
        const url = URL.createObjectURL(blob), other = window.open(url);
        if (!other) {
            alert("Looks like you have blockup popper");
            return;
        } else {
            if (other.addEventListener) {
                other.addEventListener('DOMContentLoaded', handleDone)
                return;
            }
        }
    }

}
export default class DownloadButton extends Component {

    static propTypes = {
        type: PropTypes.oneOf(['project', 'page']),
        filename: PropTypes.string.isRequired,
    };

    static defaultProps = {
        className: '',
        buttonTxtPage: 'Open as Page',
        buttonTxtProject: 'Download as Project',
        type: 'page'
    };

    constructor(...args) {
        super(...args);
        this.state = {};
    }

    label() {
        const {type, buttonTxtPage, buttonTxtProject} = this.props;
        return type === 'project' ? buttonTxtProject : buttonTxtPage;
    }

    handleDone = (e)=> {
        this.setState({done: true});
    };
    handleClick = (e) => {
        e && e.preventDefault();
        this.setState({busy: true});
        const {errors, value, sample} = this.props.data;
        sample.data = this.props.useData ? value : {};
        sample.errors = this.props.useErrors ? errors : {};
        var isPage = this.props.type === 'page';
        var ext = this.props.type === 'project' ? 'zip' : 'html';
        var filename = kebabCase(this.props.filename);
        const data = {
            jsName: camelCase(filename),
            title: this.props.filename,
            project: {
                name: kebabCase(this.props.filename),
                description: sample.description,
                version: '1.0.0'
            },
            demo:{},
            sample
        };
        var blob = generate(data, this.props.type, `${ext}-blob`);
        if (isPage) {
            openBlob(blob, this.handleDone);
            return;
        }
        try {
            saveAs(blob, `${this.props.filename}.${ext}`);
        } catch (err) {
            console.log(err);
            alert('Error saving ' + err.message);
        } finally {
            this.setState({busy: false});
        }
    };

    icon() {

        return `glyphicon ${this.props.type === 'project' ? 'glyphicon-download-alt' : 'glyphicon-open-file'}`

    }

    render() {
        return <button className={`btn btn-default ${this.props.className} ${this.state.busy ? 'btn-busy' : '' }`}
                       onClick={this.handleClick}><i
            className={this.icon()}/>{' '}{this.label()}</button>
    }
}