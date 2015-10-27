"use strict";
var React = require('react');
var ReactDOM = require('react-dom');
var Highlight = require('./Highlight.jsx');
var Playground = require('component-playground/src/components/playground.jsx');
var Subschema = require('subschema');

require("component-playground/demo/styles/syntax.css");
require("component-playground/demo/styles/codemirror.css");
require('codemirror/mode/javascript/javascript.js')
function stringify(name, obj) {

    var str = !obj ? 'null' : typeof obj === 'string' ? obj : JSON.stringify(obj, null, '\t');
    return `var ${name} = ${str};`;
}
var WrappedForm = React.createClass({
    render(){
        return <h1>hello</h1>
    }
})
var Example = React.createClass({
    getInitialState(){
        return {data: this.props.valueManager.getValue(), errors: this.props.valueManager.getErrors()};
    },
    componentWillMount(){
        this.addListeners(this.props.valueManager);
    },
    componentWillUnmount(){
        this.removeListeners(this.props.valueManager);
    },
    addListeners(valueManager){
        valueManager.addListener(null, this.setValue, this, true);
        valueManager.addErrorListener(null, this.setErrors, this, true);
    },
    removeListeners(valueManager){
        valueManager.removeListener(null, this.setValue);
        valueManager.removeErrorListener(null, this.setErrors);
    },
    componentWillReceiveProps(props){
        this.removeListeners(this.props.valueManager);
        this.addListeners(props.valueManager);
    },
    setValue(data){
        this.setState({data});
    },
    setErrors(errors){
        this.setState({errors});
    },
    render(){
        var {data, errors} = this.state;
        var {schema, setupTxt, props} = this.props;
        var valProps = {
            schema: schema,
            value: data ||{},
            errors: errors
        }
        var propStr = [], vars = [];
        Object.keys(valProps).forEach(function (v) {
            if (!valProps[v]) {
                return;
            }
            vars.push(stringify(v, valProps[v]));
            propStr.push(v + '={' + v + '}');
        });
        var codeText = [vars.join('\n'),
            stringify('form', '<Form ' + (propStr.join(' ')) + '/>'),
            'ReactDOM.render(form, mountNode)'
        ].join('\n');
        console.log('example', codeText);
        return <div className='sample-example-playground'>
            <Playground key='form' codeText={codeText} theme='monokai' collapsableCode={true} noRender={false}
                        scope={{ReactDOM, React,Form:Subschema.Form, Subschema}}
                />
        </div>
    }
})

module.exports = Example;