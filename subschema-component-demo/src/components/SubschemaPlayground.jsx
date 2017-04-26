import React, {Component} from "react";
import {Form, newSubschemaContext, PropTypes, ReactCSSReplaceTransition} from "subschema";
import Editor from "./Editor.jsx";
import {transform, availablePlugins} from "babel-standalone";
import UninjectedDisplayValueAndErrors from "./DisplayValueAndErrors.jsx";
import DownloadButton from "subschema-component-project/lib/components/DownloadButton";
import form from 'subschema-component-project/lib/form';
import {source, normalize} from 'subschema-component-project/lib/compile';

const babelrc = {
    presets: [
        "es2015-loose",
        "react",
        "stage-0"
    ]
};

function createForm(props) {
    return form({sample: {props}});
}

function map(obj, fn, scope) {
    if (obj == null) return null;
    if (Array.isArray(obj)) {
        return obj.map(fn, scope);
    }
    return Object.keys(obj).map(function (k, idx, arr) {
        return fn(obj[k], k, idx, arr);
    }, scope);

}
export default class SubschemaPlayground extends Component {
    static contextTypes = {
        defaultLoaders: PropTypes.array
    };
    static propTypes = {
        collapsableCode: PropTypes.bool,
        theme: PropTypes.string,
        context: PropTypes.object,
        initiallyExpanded: PropTypes.bool,
        previewComponent: PropTypes.node,
        expandTxt: PropTypes.string,
        collapseTxt: PropTypes.string,
        imports: PropTypes.object,
        schema: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        setupTxt: PropTypes.string.isRequired,
        value: PropTypes.any,
        errors: PropTypes.any,
        props: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)), PropTypes.arrayOf(PropTypes.string)]),
        onChange: PropTypes.func,
        filename: PropTypes.string,
        DisplayValueAndErrors: PropTypes.injectClass,
        useData: PropTypes.bool,
        useError: PropTypes.bool,
        rollUp: PropTypes.transition,
        onSubmit: PropTypes.valueEvent

    };


    static defaultProps = {
        theme: "monokai",
        rollUp: {transition: "rollUp", on: ["appear", "enter", "leave"]},
        noRender: true,
        context: {},
        setupTxt: '',
        expandTxt: "Show Example Code",
        collapseTxt: "Hide Example Code",
        initiallyExpanded: false,
        filename: 'example',
        onSubmit: "submit",
        onChange(){
        },
        DisplayValueAndErrors: UninjectedDisplayValueAndErrors
    };

    constructor(props, ...rest) {
        super(props, ...rest);
        this.state = {
            code: props.setupTxt,
            expandedCode: props.initiallyExpanded,
            external: true
        };
    }

    createEditorCode() {
        var {data, errors, useData, useError, imports, props, schema, setupTxt} = this.props;
        return normalize({sample: {data, errors, schema, imports, props, setupTxt}, useData, useError});
    }

    createFunction(editorCode) {
        let code = this.state.code;
        const Subschema = newSubschemaContext(this.context.defaultLoaders);
        const {Form, ValueManager, loader, importer} = Subschema;
        const valueManager = Form.defaultProps.valueManager = ValueManager(this.props.useData ? this.props.value : {});
        const {errors, value} = this.props;
        const {...schema} = this.props.schema;
        let funcBody;

        try {
            funcBody = `
${transform(editorCode, babelrc).code}

return {
   schema:schema
};
`;

            const func = new Function(['require', 'errors', 'value', 'schema'], funcBody);
            func(importer, errors, value, schema);
            this._compiled = func;
            this.state.error = null;
        } catch (e) {
            console.log('error', e, funcBody + '');
            this.handleError(e);
            return
        }

        if (this._compiled) {
            try {
                return this._compiled(importer, errors, value, schema);
            } catch (e) {
                console.log('error', e, funcBody + '');
                this.handleError(e);
            }
        }
        return Subschema.context;

    }

    invokeIfNeccessary(editorCode) {
        if (editorCode != this._editorCode || !this._lastInvoked) {
            this._editorCode = editorCode;
            var invoked = this.createFunction(editorCode);
            if (invoked) {
                this._lastInvoked = invoked
            }
        }
        return this._lastInvoked;
    }

    handleError(e) {
        const error = e.message;
        clearTimeout(this._timeout);

        this._timeout = setTimeout(() => {
            this.setState({error});
        }, 200);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            code: nextProps.setupTxt,
            external: true
        });
    }

    _handleCodeChange = (code) => {
        this.props.onChange(code);
        this.setState({
            code,
            external: false
        });
    };

    _toggleCode = () => {
        this.setState({
            expandedCode: !this.state.expandedCode
        });
    };


    renderToggle() {
        return <span className="playgroundToggleCodeLink" onClick={this._toggleCode}>
             {this.state.expandedCode ? this.props.collapseTxt : this.props.expandTxt}
            </span>
    }

    renderEditor(editorCode) {
        return <div key="editor">
            <Editor
                onChange={this._handleCodeChange}
                className="playgroundStage"
                codeText={editorCode}
                external={this.state.external}
                theme={this.props.theme}
            />
            <div className="prelude">
                <Editor
                    readOnly={true}
                    className="playgroundStage"
                    codeText={createForm(this.props.props)}
                    theme={this.props.theme}
                />
            </div>
        </div>
    }

    handleSubmit = (e, err, values) => {
        e && e.preventDefault();
        this.props.onSubmit(values);
    };

    render() {
        const {DisplayValueAndErrors, collapsableCode, schema, imports, props, errors, value, useData, useError, filename} = this.props;
        const editorCode = this.createEditorCode();
        const formProps = this.invokeIfNeccessary(editorCode) || {};
        const _errors = useError ? errors : null;
        const _data = useData ? value : {};

        const sample = {
            setupTxt: this.state.code,
            schema,
            data: _data,
            props,
            imports,
            errors: _errors,
            description: this.props.description
        };
        if (useError) {
            setTimeout(() => {
                formProps.valueManager.setErrors(_errors);
            }, 500)
        }

        return (
            <div>
                <div className={`playground ${collapsableCode ? "collapsableCode" : ""}`}>
                    <div className={`playgroundCode ${this.state.expandedCode ? " expandedCode" : ""}`}>
                        <ReactCSSReplaceTransition key="transition" {...this.props.rollUp}>
                            {this.state.expandedCode ? this.renderEditor(editorCode) : <span key="no-show"/> }
                        </ReactCSSReplaceTransition>
                    </div>
                    {this.state.error ? <div className="error">
                        {this.state.error}
                    </div> : null}
                    {this.renderToggle()}
                    <div className="playgroundPreview clearfix">
                        <Form {...formProps} onSubmit={this::this.handleSubmit}>
                            <div style={{width: '100%', float: 'left'}}>
                                <DisplayValueAndErrors value="."/>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className='btn-group'>
                    <DownloadButton type="page" useData={useData} useError={useError} data={{sample}}
                                    filename={filename}/>
                    <DownloadButton type="project" useData={useData} useError={useError} data={{sample}}
                                    filename={filename}/>
                </div>

            </div>
        );
    }

}