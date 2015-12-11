"use strict";

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Highlight from './Highlight.jsx';
//import Playground from 'component-playground/lib/components/playground.js';
import Subschema from 'Subschema';
import CodeMirror from 'codemirror/mode/javascript/javascript.js';
import cloneDeep from 'lodash/lang/cloneDeep';

var {PropTypes, Form, ValueManager, loaderFactory, DefaultLoader, decorators} = Subschema;
var {provide, listen} = decorators;

function stringify(name, obj) {

    var str = !obj ? 'null' : typeof obj === 'string' ? obj : JSON.stringify(obj, null, '\t');
    return `var ${name} = ${str};`;
}
var {...contextTypes} =  PropTypes.contextTypes;
contextTypes.schema = PropTypes.any;
class Context extends Component {

    static childContextTypes = contextTypes
    static contextTypes = contextTypes;
    static propTypes = contextTypes;

    getChildContext() {
        var {loader, valueManager, schema} = this.props;
        return {loader, valueManager, schema};
    }

    render() {
        return <div>{this.props.children}</div>
    }
}

class ValueManagerNode extends Component {
    @listen("value", null)
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
    static contextTypes = contextTypes;

    render() {
        if (this.props.setupFunc) {
            this.props.setupFunc(this.context.loader, this.context.schema, Subschema, React, this.context.valueManager);
        }
        provide.defaultLoader = this.context.loader;
        var schema = cloneDeep(this.context.schema);

        return <Form schema={schema} valueManager={this.context.valueManager}
                     loader={this.context.loader}/>;
    }
}

export default class Example extends Component {

    static contextTypes = PropTypes.contextTypes;

    static propTypes = {
        example: PropTypes.string,

    };


    constructor(props, ...rest) {
        super(props, ...rest);
        this.setup(props);
    }

    componentWillUnmount() {
        provide.defaultLoader = this.context.loader;
    }

    componentWillReceiveProps(props) {
        if (props.example !== this.props.example)
            this.setup(props);
    }

    setup(props) {
        var example = require('../samples/' + props.example);
        var config = this.config = {
            example
        }
        if (example.setupFile) {
            config.setupTxt = require('!raw!!../samples/' + example.setupFile.replace(/^\.\/?/, ''))
            config.setupFunc = require('../sample-loader!../samples/' + example.setupFile.replace(/^\.\/?/, ''))
        } else {
            config.setupTxt = '';
        }


    }

    render() {
        var value = {}, errors = null;
        if (this.props.useData) {
            value = this.config.example.data;
        }
        if (this.props.useError) {
            errors = this.config.example.errors;
        }
        var loader = loaderFactory([DefaultLoader]);

        var valueManager = ValueManager(value, errors);


        return <div>
            <h3>{this.props.example}</h3>
            <p>{this.config.example.description}</p>

            <Context valueManager={valueManager} loader={loader} schema={cloneDeep(this.config.example.schema)}>
                <RenderPreview/>
                <ValueManagerNode/>
                <Highlight>
                    {`
"use strict";

import React from 'react';
import Subschema from 'subschema';


${this.config.setupTxt}

var schema = ${JSON.stringify(this.config.example.schema, null, 2)}
<Form schema={schema} loader={loader} valueManager={valueManager}/>
                        `}


                </Highlight>
            </Context>
        </div>
    }

    renderPreview() {
        return <RenderPreview setupFunc={this.config.setupFunc}/>
    }

    renderEdit() {
        console.log('render sample');
        var {data, errors} = this.state;
        var {schema, setup, setupTxt, props} = this.props;
        var valProps = {
                schema: schema,
                value: data || {},
                errors: errors
            }, valueManager = ValueManager(),
            FormWrapper = function (props) {

                var {...copy} = props;
                if (props.valueManager) {
                    valueManager.setValue(props.valueManager.getValue());
                    copy.valueManager = valueManager;
                } else {
                    valueManager.setValue(copy.value);
                    copy.valueManager = valueManager
                }
                return <Subschema.Form {...copy}/>;
            }, scope = {React, ReactDOM, Form: FormWrapper, Subschema};
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
            '(function () {',
            '//uncomment these if you are using outside of the editor',
            '//"use strict";',
            '//' + stringify('React', 'require("react")'),
            '//' + stringify('Subschema', 'require("subschema")'),
            '//' + stringify('Form', 'Subschema.Form'),
            vars.join('\n'),
            setupTxt,
            'return <Form ' + (propStr.join(' ')) + '/>',
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
