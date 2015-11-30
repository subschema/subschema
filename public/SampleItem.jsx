"use strict";
var React = require('react');
var SampleMgr = require('./SampleMgr.jsx');
var Subschema = require('subschema')
var Form = Subschema.Form
var ValueManager = Subschema.ValueManager;
var Example = require('./SampleExample.jsx')

var SampleItem = React.createClass({


    componentWillMount(){
        SampleMgr.valueManager().addListener(null, this.setValue, this);


    },

    componentWillUnmount(){
        SampleMgr.valueManager().removeListener(null, this.setValue);
        if (this._loaded) {
            Subschema.loader.removeLoader(this._loaded);
        }
        //this.vm.removeAll();
        this.vm = null;
    },

    componentWillReceiveProps(newProps){

        if (newProps.sample != this.state.sample) {
            //We will create a new ValueManager every time a
            // a  new sample.  In order to prevent leaks
            this.vm.removeAll();
            this.vm = ValueManager();
        }
        var obj = this.setUpProps(newProps);
        this.updateVM(SampleMgr.valueManager().getValue(), obj.content);
        this.setState(obj);

    },

    getInitialState(){
        this.vm = new ValueManager();
        return this.setUpProps(this.props);
    },
    setUpProps(props){
        var s = SampleMgr.lookupSample(props.sample);
        var file = s.file;
        var state = this.state || {};
        var content = require('./samples/' + s.file);
/*
        if (state.content !== content) {
            if (this._loaded) {
                Subschema.loader.removeLoader(this._loaded);
            }
            this._loaded = content.setup && content.setup(Subschema, this);
        }

*/

        return {
            schema: content.schema,
            content,
            setup:content.setup,
            file,
            sample: props.sample
        };
    },

    updateVM(value, content){
        if ('loadData' in value)
            this.vm.setValue(value.loadData ? content.data : {});

        if ('loadErrors' in value)
            this.vm.setErrors(value.loadErrors ? content.errors : {});

    },
    setValue(value){
        var content = this.state.content;
        this.updateVM(value, content);
    },
    handleSubmit(e, action){
        e && e.preventDefault();
        alert('submit called');
    },
    handleErrors(){
    },
    handleBtn(e, action, component){
        if (action === 'cancel'){
            e && e.preventDefault();
        }
        alert('button was clicked '+action);
    },
    render () {
        var schema = this.state.schema;
        var { description, title, setup, setupTxt, props, data, errors, teardown} = (this.state || {}).content || {};

        var file = this.state.file;
        title = title || file.replace(/\.js(x)?/, '');
        return (
            <div>
                <h3>{title}</h3>
                <fieldset>
                    <legend></legend>
                    <p className="lead" dangerouslySetInnerHTML={{__html: description || ''}}/>

                    <div className="span10">
                        <div className="container-fluid">
                            <h4>Example:</h4>
                            <Example valueManager={this.vm} schema={schema} setup={setup} props={props} setupTxt={setupTxt}
                                     ref="example" key={`example-${title}`}/>
                        </div>

                    </div>
                </fieldset>
            </div>
        );
    }
});
module.exports = SampleItem;