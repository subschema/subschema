import React, {Component} from "react";
import PropTypes from 'subschema-prop-types';
import CodeMirror from 'codemirror';

export default class Editor extends Component {

    static propTypes = {
        theme: PropTypes.string,
        readOnly: PropTypes.bool,
        external: PropTypes.bool,
        codeText: PropTypes.string,
        onChange: PropTypes.func,
        style: PropTypes.object,
        className: PropTypes.string,
        mode: PropTypes.string,
        lineNumbers: PropTypes.bool,
        lineWrapping: PropTypes.bool,
        smartIndent: PropTypes.bool,
        matchBrackets: PropTypes.bool,
    };
    static defaultProps = {
        mode:"jsx",
        lineNumbers: false,
        lineWrapping: true,
        smartIndent: false,
        matchBrackets: true,
    };

    componentDidMount() {
        const {onChange, codeText, style, className, ...config} = this.props;
        this.editor = CodeMirror.fromTextArea(this.refs.editor, config);
        this.editor.on("change", this._handleChange);
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
