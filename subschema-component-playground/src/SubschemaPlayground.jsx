import React, {Component} from "react";
import PropTypes from 'subschema-prop-types';
import {ReactCSSReplaceTransition} from 'subschema-component-form';
import {Form, newSubschemaContext} from "subschema";
import UninjectedDisplayValueAndErrors from "./DisplayValueAndErrors.jsx";
import {source, normalize} from 'subschema-project/lib/compile';
import Compiler from './Compiler';

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
        useErrors: PropTypes.bool,
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
            expandedCode: props.initiallyExpanded,
            external: true,
        };
    }

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

    handleSubmit = (e, err, values) => {
        e && e.preventDefault();
        this.props.onSubmit(values);
    };

    handleContextChange = (context) => {
        this.setState({context});
    };
    renderForm(){
        const {DisplayValueAndErrors} = this.props;

        if (!this.state.context){
            return <div>Loading...</div>
        }
        return   <Form {...this.state.context} onSubmit={this.props.onSubmit}>
            <div style={{width: '100%', float: 'left'}}>
                <DisplayValueAndErrors value="."/>
            </div>
        </Form>
    }

    render() {
        const {form, schema, imports, props, errors, value, useData, useErrors, filename} = this.props;

        return (
            <div>
                {this.renderToggle()}
                <div className={`playgroundCode ${this.state.expandedCode ? " expandedCode" : ""}`}>
                    <ReactCSSReplaceTransition key="transition" {...this.props.rollUp}>
                        <Compiler onError={this.handleError} onContextChange={this.handleContextChange}
                                  theme={this.props.theme}
                                  collapsableCode={this.state.collapsableCode}
                                  display={this.state.expandedCode}
                                  schema={schema}
                                  imports={imports}
                                  setupTxt={this.props.setupTxt}
                                  form={form}
                                  props={props}
                                  value={value}
                                  useErrors={useErrors}
                                  useData={useData}
                                  filename={filename}
                                  errors={errors}
                        />

                    </ReactCSSReplaceTransition>
                </div>
                <div className="playgroundPreview clearfix">
                    {this.renderForm()}
                </div>

            </div>
        );
    }

}