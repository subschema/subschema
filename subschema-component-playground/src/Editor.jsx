import React, { Component } from 'react';
import PropTypes from 'subschema-prop-types';
import CodeMirror from 'codemirror';
import 'codemirror/mode/jsx/jsx';
import './Editor.css';

export default class Editor extends Component {

    static propTypes    = {
        theme            : PropTypes.string,
        readOnly         : PropTypes.bool,
        external         : PropTypes.bool,
        codeText         : PropTypes.string,
        onChange         : PropTypes.func,
        style            : PropTypes.object,
        className        : PropTypes.string,
        mode             : PropTypes.string,
        lineNumbers      : PropTypes.bool,
        lineWrapping     : PropTypes.bool,
        smartIndent      : PropTypes.bool,
        matchBrackets    : PropTypes.bool,
        errors           : PropTypes.array,
        codeMirrorFactory: PropTypes.func
    };
    static defaultProps = {
        mode             : "jsx",
        lineNumbers      : false,
        lineWrapping     : true,
        smartIndent      : false,
        matchBrackets    : true,
        codeMirrorFactory: (ele, config) => CodeMirror.fromTextArea(ele,
            config),
    };

    widgets = [];
    state   = {};

    updateHints(errors) {
        const { widgets = [], editor } = this;
        editor.operation(function () {
            for (let i = 0, l = widgets.length; i < l; ++i) {
                editor.removeLineWidget(widgets[i]);
            }
            widgets.length = 0;
            if (errors) {
                for (let i = 0, l = errors.length; i < l; i++) {
                    const err = errors[i];
                    if (!err || !err.loc) {
                        return;
                    }
                    console.log('error at ', err.loc);
                    const msg      = document.createElement("div");
                    const icon     = msg.appendChild(
                        document.createElement("span"));
                    icon.innerHTML = "  ";
                    icon.className = "lint-error-icon";
                    msg.appendChild(document.createTextNode(err.message));
                    msg.className = "CodeMirror-lint-marker-error";
                    widgets.push(editor.addLineWidget(err.loc.line - 3, msg,
                        { coverGutter: false, noHScroll: true }));
                }
            }
        });
    }

    componentDidMount() {
        const { onChange, codeText, errors, style, className, ...config } = this.props;
        this.editor                                                       =
            this.props.codeMirrorFactory(this.refs.editor, config);
        this.editor.on("change", this._handleChange);
        this.updateHints(errors);
    }

    componentWillReceiveProps({ errors }) {
        if (errors != this.props.errors) {
            this.updateHints(errors);
        }
    }

    componentDidUpdate() {
        if (this.props.readOnly || this.props.external) {
            this.editor.setValue(this.props.codeText);
        }
    }

    _handleChange = () => {
        if (!this.props.readOnly && this.props.onChange) {
            this.props.onChange(this.editor.getValue());
        }
    };

    render() {
        return (
            <div style={this.props.style} className={this.props.className}>
                <textarea ref="editor" defaultValue={this.props.codeText}/>
            </div>
        );
    }
}
