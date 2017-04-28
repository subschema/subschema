import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {newSubschemaContext} from 'subschema';
import {transform, availablePlugins} from "babel-standalone";
import {source, normalize} from 'subschema-component-project/lib/compile';
import Editor from './Editor';
import form from 'subschema-component-project/lib/form';
const babelrc = {
    presets: [
        "es2015-loose",
        "react",
        "stage-0"
    ],
    retainLines: true
};
function createForm(props) {
    return form({sample: {props}});
}
export default class Compiler extends Component {

    static propTypes = {
        editorCode: PropTypes.string,
        schema: PropTypes.object.isRequired,
        value: PropTypes.object,
        setupTxt: PropTypes.string,
        errors: PropTypes.object,
        useData: PropTypes.bool,
        useErrors: PropTypes.bool,
        filename: PropTypes.string.isRequired,
        theme: PropTypes.string,
        props: PropTypes.array,
        imports: PropTypes.object

    };
    static defaultProps = {
        theme: "monokai",

        onError(error){
        },
        onContextChange(context){

        }
    };

    state = {
        schema: this.props.schema,
        value: this.props.value
    };

    componentWillMount() {
        this.editorCodeFromSampleText(this.props);
    }

    editorCodeFromSampleText(newProps) {
        const {setupTxt, useData, useErrors, value, imports, props, schema, errors} = newProps;
        this.handleUpdate(normalize({
            useData,
            useErrors,
            sample: {schema, props, setupTxt, value: useData ? value : null, errors: useErrors ? errors : null}
        }), newProps);
    };

    handleUpdate(editorCode, props) {
        const {schema, value, errors, useData, useErrors, ...rest} = props;
        rest.sample = {schema, sampleTxt: editorCode, value, errors};
        //update editorCode no matter what so that errors can be resolved.
        if (this.state.editorCode === editorCode) {
            return;
        }
        this.setState({editorCode});
        let func;
        try {
            //babel lize the code
            func = new Function(['require', 'schema', 'valueManager', 'loader'], `${transform(editorCode, babelrc).code}
            
            //generated code
            return {schema:schema, loader:loader, valueManager:valueManager}
            `);
        } catch (error) {
            console.trace(error);
            this.setState({error});
            this.props.onError(error);
            //syntax error likely
            return;
        }
        let {loader, valueManager, importer} = newSubschemaContext();
        if (useData) {
            valueManager.setValue(value);
        }
        if (useErrors) {
            valueManager.setErrors(errors);
        }

        try {
            const context = func(importer, this.state.schema, valueManager, loader);
            this.setState({context});
            this.props.onContextChange(context);
        } catch (error) {
            console.trace(error);
            this.setState({error});
            this.props.onError(error);
            return;
        }
        this.setState({error: null});


    }

    handleEditorChange = (editorCode) => {
        clearTimeout(this._to);
        this._to = setTimeout(() => {
            this.handleUpdate(editorCode, this.props)
        }, 500);
    };


    componentWillReceiveProps(nextProps) {
        const {setupTxt} = nextProps;
        //new sample.
        if (this.props.filename != nextProps.filename) {
            this.editorCodeFromSampleText(nextProps);
            //state change
        } else if (this.props.useErrors != nextProps.useErrors || this.props.useData != nextProps.useData) {
            const {context} = this.state;
            if (context && context.valueManager) {

                if (nextProps.useData) {
                    context.valueManager.setValue(nextProps.value);
                } else if (nextProps.useData != this.props.useData) {
                    context.valueManager.setValue({});
                }

                if (nextProps.useErrors) {
                    context.valueManager.setErrors(nextProps.errors);
                } else if (nextProps.useErrors != this.props.useErrors) {
                    context.valueManager.setErrors({});
                }
            } else {
                console.warn(`I do not understand this update`);
            }
            //this.handleUpdate(this.state.editorCode, nextProps);

        }
    }

    renderEditor() {
        return (<div key="editor">
            <Editor
                onChange={this.handleEditorChange}
                className="playgroundStage"
                codeText={this.state.editorCode}
                theme={this.props.theme}
                errors={this.state.error ? [this.state.error] : null}
                lineNumbers={true}
                mode={"javascript"}
                gutters={["CodeMirror-lint-markers"]}
                lint={true}
            />
            <div className="prelude">
                <Editor readOnly={true}
                        className="playgroundStage"
                        codeText={createForm(this.props.form)}
                        theme={this.props.theme}
                />
            </div>

        </div>)
    }

    //let the compiler do its thing regardless.
    render() {
        return this.props.display ? this.renderEditor() : <span key="no-show"/>
    }
}
