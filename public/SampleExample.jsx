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

    var str = !obj ? 'null' : JSON.stringify(obj, null, '\t');
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

        var example =
            [
                stringify('schema', schema),
                stringify('data', data),
                stringify('errors', errors),
                stringify('props', props || {}),
                'ReactDOM.render(<Form schema={schema} value={data} errors={errors} {...props}/>, mountNode)'
            ].join('\n');

        return <div className='sample-example-playground'>
            <Playground key='form' codeText={example} theme='monokai' collapsableCode={true} noRender={false} scope={{ReactDOM, React,Form:Subschema.Form, Subschema}}
                       />
        </div>
    }
})
/*        return <Highlight lang='javascript'>
 <div>var Subschema = require('subschema');</div>
 <div>var Form = Subschema.Form;</div>
 <div>var React = require('react');</div>
 <div>var data = {JSON.stringify(data || {}, null, 2)};</div>
 <div>var errors = {JSON.stringify(errors || {}, null, 2)};</div>
 <div>var schema = {JSON.stringify(schema || {}, null, 2)};</div>
 { setupTxt ? <div>{setupTxt}</div> : null}
 <div>{'React.render(<Form value={data} schema={schema} errors={errors} ' + propsstr + '/>, document.getElementById("content"))'}</div>
 </Highlight>*/
module.exports = Example;