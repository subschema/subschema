"use strict";
var React = require('react');
var ReactDOM = require('react-dom');
var Highlight = require('./Highlight.jsx');
var Playground = require('component-playground/lib/components/playground.js');
var Subschema = require('subschema');
var ValueManager = Subschema.ValueManager;

require('codemirror/mode/javascript/javascript.js');

function stringify(name, obj) {

    var str = !obj ? 'null' : typeof obj === 'string' ? obj : JSON.stringify(obj, null, '\t');
    return `var ${name} = ${str};`;
}

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
var SampleExample = React.createClass({
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
});

module.exports = SampleExample;