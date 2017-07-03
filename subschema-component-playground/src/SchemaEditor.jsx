import React, { PureComponent } from 'react';
import { Editor } from 'subschema-component-playground';
import PropTypes from 'subschema-prop-types';
import CodeMirror from 'codemirror';
import 'codemirror/addon/lint/json-lint';

const parseJson = (v, cb = console.trace) => {
    if (v == null) {
        return v;
    }
    if (typeof v === 'string') {
        try {
            return JSON.parse(v);
        } catch (e) {
            cb && cb(e);
            return;
        }
    }
    return v;
};

const codeMirrorFactory = (ele, config) => {


    const cm = CodeMirror.fromTextArea(ele, Object.assign({}, config, {
        matchBrackets    : true,
        autoCloseBrackets: true,
        mode             : "application/json",
        lineWrapping     : true,
        pollInterval     : 300
    }));
    return cm;
};

export default class SchemaEditor extends PureComponent {
    static propTypes    = {
        onChange: PropTypes.valueEvent,
        value   : PropTypes.value
    };
    static defaultProps = {
        mode: "application/json"
    };

    state = {
        codeText: JSON.stringify(this.props.value, null, 2)
    };

    componentWillReceiveProps(props) {
        if (props.value != this.props.value) {
            this.setState({ codeText: JSON.stringify(props.value, null, 2) });
        }
    }

    handleChange = (codeText) => {
        clearTimeout(this._to);
        this.setState({ codeText });
        const schema = parseJson(codeText, this._handleError);

        if (schema) {
            this.setState({ errors: null });
            this.props.onChange(schema);
        }
    };
    _handleError = (e) => {
        const pos     = parseInt((e + '').replace(/.*at position (\d*)$/, '$1'),
            10);
        const message = e.message.replace(/at position \d*$/, '');
        if (pos) {
            const { codeText } = this.state;
            let line           = 2;
            let offset         = 0;

            for (let i = 0, l = codeText.length; i < l; i++) {
                if (codeText[i] === '\n') {
                    line++;
                    offset = 0;
                } else if (i === pos) {
                    break;
                } else {
                    offset++;
                }
            }
            this.setState({ errors: [{ message, loc: { line, offset } }] });
        } else {
            console.trace(e);
        }
    };

    render() {
        return <Editor codeText={this.state.codeText}
                       mode={this.props.mode}
                       codeMirrorFactory={codeMirrorFactory}
                       errors={this.state.errors}
                       onChange={this.handleChange}/>
    }
}
