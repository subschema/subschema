import React, { Component } from 'react';
import PropTypes from 'subschema-prop-types';
import { ReactCSSReplaceTransition, templates } from 'subschema-component-form';
import { Form } from 'subschema';
import UninjectedDisplayValueAndErrors from './DisplayValueAndErrors.jsx';
import { normalize, source } from 'subschema-project/lib/compile';
import Compiler from './Compiler';
import SchemaEditor from './SchemaEditor';
const UninjectedButtonsTemplate = templates.ButtonsTemplate;

export default class SubschemaPlayground extends Component {
    static contextTypes = {
        defaultLoaders: PropTypes.array
    };
    static propTypes    = {
        collapsableCode      : PropTypes.bool,
        theme                : PropTypes.string,
        context              : PropTypes.object,
        initiallyExpanded    : PropTypes.bool,
        previewComponent     : PropTypes.node,
        expandTxt            : PropTypes.string,
        collapseTxt          : PropTypes.string,
        imports              : PropTypes.object,
        schema               : PropTypes.oneOfType(
            [PropTypes.object, PropTypes.string]),
        setupTxt             : PropTypes.string.isRequired,
        value                : PropTypes.any,
        errors               : PropTypes.any,
        props                : PropTypes.oneOfType([PropTypes.arrayOf(
            PropTypes.arrayOf(PropTypes.string)), PropTypes.arrayOf(
            PropTypes.string)]),
        onChange             : PropTypes.func,
        filename             : PropTypes.string,
        DisplayValueAndErrors: PropTypes.injectClass,
        useData              : PropTypes.bool,
        useErrors            : PropTypes.bool,
        rollUp               : PropTypes.transition,
        onSubmit             : PropTypes.valueEvent,
        buttons              : PropTypes.any,
        ButtonsTemplate      : PropTypes.injectClass

    };


    static defaultProps = {
        ButtonsTemplate      : UninjectedButtonsTemplate,
        theme                : "monokai",
        rollUp               : {
            transition: "rollUp",
            on        : ["appear", "enter", "leave"]
        },
        noRender             : true,
        context              : {},
        setupTxt             : '',
        expandTxt            : "Show Example Code",
        collapseTxt          : "Hide Example Code",
        initiallyExpanded    : false,
        filename             : 'example',
        onSubmit             : "submit",
        buttons              : {
            buttonsClass: 'btn-group btn-group-xs',
            buttonClass : 'btn btn-default',
            buttons     : {
                'schema': {
                    label  : 'Schema',
                    primary: false
                },
                'edit'  : {
                    label  : "Code",
                    primary: false
                },
            }
        },
        onChange(){
        },
        DisplayValueAndErrors: UninjectedDisplayValueAndErrors
    };

   state = {
       external:true,
       buttons:this.props.buttons.buttons
   };

    componentWillReceiveProps(props) {
        if (props.buttons != this.props.buttons) {
            this.setState('buttons', props.buttons.buttons);
        }
    }

    handleBtnClick = (e, action) => {
        e && e.preventDefault();
        const toggle = action === this.state.action;

        const buttons = {
            ...this.state.buttons,
        };
        if (this.state.buttons[this.state.action]) {
            buttons[this.state.action] = {
                ...buttons[this.state.action],
                primary: false
            }
        }

        buttons[action] = {
            ...this.state.buttons[action],
            primary: !toggle
        };
        if (toggle) {
            action = null;
        }
        this.setState({
            action,
            buttons
        });
    };

    renderToggle() {
        const { ButtonsTemplate } = this.props;
        return <ButtonsTemplate {...this.props.buttons}
                                buttons={this.state.buttons}
                                onButtonClick={this.handleBtnClick}/>
    }

    handleSubmit = (e, err, values) => {
        e && e.preventDefault();
        this.props.onSubmit(values);
    };

    handleContextChange = (context) => {
        this.setState({ context });
    };

    handleSchemaChange = (schema) => {
        const { ...context } = this.state.context;
        context.schema       = schema;
        this.setState({ context });
    };

    renderForm() {
        const { DisplayValueAndErrors } = this.props;

        if (!this.state.context) {
            return <div>Loading...</div>
        }
        return <Form {...this.state.context} onSubmit={this.props.onSubmit}>
            <div style={{ width: '100%', float: 'left' }}>
                <DisplayValueAndErrors value="."/>
            </div>
        </Form>
    }


    render() {
        const { form, schema, imports, props, errors, value, useData, useErrors, filename } = this.props;

        return (
            <div>
                {this.renderToggle()}
                <div key='code-editor'
                     className={`playgroundCode ${this.state.action == 'edit'
                         ? " expandedCode" : ""}`}>
                    <ReactCSSReplaceTransition
                        key="transition" {...this.props.rollUp}>
                        <Compiler onError={this.handleError}
                                  onContextChange={this.handleContextChange}
                                  theme={this.props.theme}
                                  collapsableCode={this.state.collapsableCode}
                                  display={this.state.action == 'edit'}
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
                <div key='schema-editor'
                     className={`playgroundCode ${this.state.action == 'schema'
                         ? " expandedCode" : ""}`}>
                    <ReactCSSReplaceTransition
                        key="transition" {...this.props.rollUp}>
                        { this.state.action == 'schema' ?
                          <SchemaEditor value={schema}
                                        onChange={this.handleSchemaChange}/>
                            : null }

                    </ReactCSSReplaceTransition>
                </div>
                <div className="playgroundPreview clearfix">
                    {this.renderForm()}
                </div>

            </div>
        );
    }

}
