"use strict";

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Highlight from './Highlight.jsx';
import Playground from 'component-playground/lib/components/playground.js';
import Subschema from 'Subschema';
import CodeMirror from 'codemirror/mode/javascript/javascript.js';
import cloneDeep from 'lodash/lang/cloneDeep';

var {PropTypes, Form, ValueManager, loaderFactory, DefaultLoader, decorators} = Subschema;
var {provide, listen} = decorators;

function stringify(name, obj) {

    var str = !obj ? 'null' : typeof obj === 'string' ? obj : JSON.stringify(obj, null, '\t');
    return `var ${name} = ${str};`;
}

class ValueManagerNode extends Component {
    componentWillMount() {
        this.setup(this.props);
    }

    componentWillReceiveProps(props) {
        if (props.valueManager !== this.props.valueManager)
            this.setup(props);
    }

    setup(props) {
        this.unlisten();
        this._listeners = [
            props.valueManager.addListener(null, this.update, this, true),
            props.valueManager.addErrorListener(null, this.error, this, true)]
    }

    unlisten() {
        if (this._listeners) this._listeners.forEach(v=>v.remove());
    }

    componentWillUnmount() {
        this.unlisten();
    }

    error(errors) {
        this.setState({errors});
    }

    update(value) {
        this.setState({value});
    }

    render() {
        return <div>
            <h3>Values:</h3>
 <pre className='value-manager-node'>
 {JSON.stringify(this.state ? this.state.value : null, null, '\t')}
 </pre>
        </div>
    }
}

class RenderPreview extends Component {

    render() {
        if (this.props.setupFunc) {
            this.props.setupFunc(this.props.loader, this.props.schema, Subschema, React, this.props.valueManager);
        }
        var schema = cloneDeep(this.props.schema);

        return <Form key={'form-'+this.props.example} schema={schema} valueManager={this.props.valueManager}
                     loader={this.props.loader}/>;
    }
}

export default class Example extends Component {

    static contextTypes = PropTypes.contextTypes;

    static propTypes = {
        example: PropTypes.string,

    };

    componentWillMount() {
        if (!this.state) this.state = {edit: true};
        this.setup(this.props);
    }

    componentWillUnmount() {
        provide.defaultLoader = this.context.loader;
    }

    componentWillReceiveProps(props) {
        if (!this.managed || props.example !== this.props.example) {
            this.setup(props);
            this.forceUpdate();
        } else {
            if (props.useData !== this.props.useData) {
                this.managed.valueManager.setValue(props.useData ? this.managed.data : {});
            }
            if (props.useError !== this.props.useError) {
                this.managed.valueManager.setErrors(props.useError ? this.managed.errors : null);
            }
        }
    }

    setup(props) {
        var {schema, ...managed} = require('../samples/' + props.example);
        var setupFile = managed.setupFile;
        this.managed = managed;
        if (setupFile) {
            setupFile = setupFile.replace(/^\.\/?/, '');
            managed.setupTxt = require('!raw!!../samples/' + setupFile)
            managed.setupFunc = require('../sample-loader!../samples/' + setupFile)
        } else {
            managed.setupTxt = '';
            managed.setupFunc = function () {
            }
        }
        var value = {}, errors = null;
        if (props.useData) {
            value = managed.data;
        }
        if (props.useError) {
            errors = managed.errors;
        }
        managed.schema = cloneDeep(schema);

        managed.loader = provide.defaultLoader = loaderFactory([DefaultLoader]);

        managed.valueManager = ValueManager(value, errors);

    }

    schema() {
        return JSON.stringify(this.managed.schema, null, 2);
    }

    handleEditClick = ()=>this.setState({edit: !this.state.edit})

    render() {
        var schema = this.schema();
        return <div>
            <h3>{this.props.example}</h3>
            <p>{this.managed.description}</p>
            <RenderPreview {...this.managed}/>
            <ValueManagerNode valueManager={this.managed.valueManager}/>
            {this.state.edit ? this.renderEdit() : <Highlight lang="js" key={'highlight-'+this.props.example}
                                                              onClick={this.handleEditClick}>
                {
                    `
"use strict";

import React from 'react';
import Subschema from 'subschema';
import ReactDOM from 'react-dom';

${this.managed.setupTxt}

var schema = ${schema}
ReactDOM.render(<Form schema={schema} loader={loader} valueManager={valueManager}/>, document.getElementById('content'));
`}


            </Highlight>}
        </div>
    }

    renderPreview() {
        return <RenderPreview {...this.managed}/>
    }

    renderEdit() {
        console.log('render sample');
        var {schema, setup, setupTxt, props, data,errors, valueManager, loader} = this.managed;
        var valProps = {
            schema: schema,
            value: data || {},
            errors: errors
        }, scope = {
            Form,
            React,
            Subschema,
            loader,
            valueManager
        };
        if (setup) {
            setup(scope, valProps);
        }
        var propStr = [], vars = [];
        Object.keys(valProps).forEach(function (v) {
            if (!valProps[v]) {
                return;
            }
            vars.push(stringify(v, valProps[v]));
            propStr.push(v + '={' + v + '}');
        });
        var codeText = [
            `(function () {
"use strict";
//uncomment these if you are using outside of the editor
//import React, {Component} from "react";
//import Subschema,{Form} from "Subschema";
            `,
            vars.join('\n'),
            setupTxt,
            `return <Form ${propStr.join(' ')} />`,
            '}())'
        ].join('\n');
        //    console.log('example\n\n', codeText, '\n\n');
        return <div className='sample-example-playground'>
            <Playground key={'form-'+(data? 'data' :'no-data')}
                        codeText={codeText} theme='monokai'
                        collapsableCode={true}
                        scope={scope}

            />
            <ValueManagerNode valueManager={valueManager}/>
        </div>
    }
}
