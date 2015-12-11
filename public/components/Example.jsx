"use strict";

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Highlight from './Highlight.jsx';
import Playground from 'component-playground/lib/components/playground.js';
import Subschema from 'Subschema';
import CodeMirror from 'codemirror/mode/javascript/javascript.js';
import cloneDeep from 'lodash/object/cloneDeep';

var {PropTypes, Form, ValueManager, loaderFactory, DefaultLoader, decorators} = Subschema;
var {provide} = decorators;

function stringify(name, obj) {

    var str = !obj ? 'null' : typeof obj === 'string' ? obj : JSON.stringify(obj, null, '\t');
    return `var ${name} = ${str};`;
}

/*
 var ValueManagerNode = React.createClass({
 componentWillMount(){
 this._setup({}, this.props)
 },
 componentWillReceiveProps(newProps, oldProps){
 this._setup(oldProps, newProps);
 },
 _setup(old, newProps){
 this._listener && this._listener.remove();
 if (newProps.valueManager) {
 this._listener = newProps.valueManager.addListener(null, this.update, this, true);
 } else {
 console.log('no valueManager');
 }
 },
 update(value){
 this.setState({value});
 },
 componentWillUnmount(){
 this._listener && this._listener.remove();
 },
 render(){
 return <div>
 <h3>Values:</h3>
 <pre className='value-manager-node'>
 {JSON.stringify(this.state ? this.state.value : null, null, '\t')}
 </pre>
 </div>
 }

 })
 */

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
            config.setupTxt = require('!raw!!../samples/' + example.setupFile.replace(/\.\/?/, ''))
            config.setupFunc = require('../sample-loader!../samples/' + example.setupFile.replace(/\.\/?/, ''))
        }


    }

    render() {
        return <div>
            <h3>{this.props.example}</h3>
            <p>{this.config.example.description}</p>
            {this.renderPreview()}
            <Highlight>
                {`
"use strict";

import Subschema from 'subschema';

var {loader, ValueManager } = Subschema;

var schema = ${JSON.stringify(this.config.example.schema, null, 2)}

                    `}


            </Highlight>
        </div>
    }

    renderPreview() {
        var value = {}, errors = null;
        if (this.props.useData) {
            value = this.config.example.data;
        }
        if (this.props.useError) {
            errors = this.config.example.errors;
        }
        var loader = loaderFactory([DefaultLoader]);

        var valueManager = ValueManager(value, errors);
        var schema = cloneDeep(this.config.example.schema);
        if (this.config.setupFunc) {
            this.config.setupFunc(loader, schema, Subschema, React, valueManager);
        }
        provide.defaultLoader = loader;


        return <Form schema={schema} valueManager={valueManager} loader={loader}/>;
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
