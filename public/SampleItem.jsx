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
        if (state.content !== content) {
            if (this._loaded) {
                Subschema.loader.removeLoader(this._loaded);
            }
            this._loaded = content.setup && content.setup(Subschema, this);
        }


        return {
            schema: content.schema,
            content,
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
    handleSubmit(){
        alert('submit called');
    },
    handleErrors(){
    },

    render () {
        var schema = this.state.schema;
        var { description, title, setup, setupTxt, props, data, errors, teardown} = (this.state || {}).content || {};

        var file = this.state.file;
        if (setup && !setupTxt) {
            var tmp = setup.toString().replace(setupRe, '$1').replace(/__webpack_require__\(\d+?\)/g, 'require("subschema")').split('\n').map(function (v) {
                return v.replace(/^	        /, '');
            });
            setupTxt = tmp.join('\n')
        }

        title = title || file.replace(/\.js(x)?/, '');
        return (
            <div>
                <h3>{title}</h3>
                <fieldset>
                    <legend></legend>
                    <p className="lead" dangerouslySetInnerHTML={{__html: description || ''}}/>

                    <div className="span10">
                        <div className="container-fluid">
                            <div className="row-fluid">
                                <div className="span12">
                                    <div className="panel panel-default">
                                        <div className="panel-body">

                                            <Form ref="form" schema={schema}
                                                  key="form"
                                                  valueManager={this.vm}
                                                  onSubmit={this.handleSubmit}
                                                  onValidate={this.handleErrors}
                                                {...props}
                                                />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h4>Example:</h4>
                            <Example valueManager={this.vm} schema={schema} props={props} setupTxt={setupTxt}
                                     ref="example" key="example"/>
                        </div>

                    </div>
                </fieldset>
            </div>
        );
    }
});
module.exports = SampleItem;