var React = require('react');
var Form = require('subschema').Form;
var tu = require('../src/tutils');
var Alert = require('react-bootstrap/lib/Alert');
var Modal = require('react-bootstrap/lib/Modal');
var ModalTrigger = require('react-bootstrap/lib/ModalTrigger');
var Button = require('react-bootstrap/lib/Button');
var _ = require('lodash');
require('./index.less');
var setupRe = /^function [^{]*\{([\s\S]*)\}$/;
var ValueManager = require('../src/ValueManager');
var MyModal = React.createClass({
    render() {
        return (
            <Modal {...this.props} bsStyle='primary' title='Submit' animation={true}>
                <div className='modal-body'>
                    {this.props.errors ? <h3>Errors</h3> : null}
                    {this.props.errors && Object.keys(this.props.errors).map((key)=> {
                        return <div>
                            <h4>{key}</h4>
                            <ul>
                                {this.props.errors[key].map((v)=> {
                                    return <li>{v}</li>
                                })}
                            </ul>
                        </div>
                    })}
                    <div>
                        <h2>Values</h2>
                        <pre>{JSON.stringify(this.props.value, void(0), 2)}}</pre>
                    </div>
                </div>
                <div className='modal-footer'>
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                </div>
            </Modal>
        );
    }
});
var samples = require.context('./samples/', true, /\.js(x)?$/).keys().map((v)=> {
    return {
        name: v.replace(/\.\/(.*)\.js(x)?/, '$1'),
        file: v.replace('./', '')
    };
});

var App = React.createClass({
    getInitialState(){
        return {
            loadErrors: false,
            loadData: false,
            data: null,
            errors: {},
            file: 'Autocomplete.js',
            description: ''
        }
    },
    componentWillMount(){
        var vm = this.vm = new ValueManager();
        vm.addListener(null, (data)=> {
            this.setState({
                data
            });
        });
        this.loadFile();
    },

    changeFile(e) {
        this.state.file = e.target.value;
        this.loadFile();
    },
    loadFile(){
        if (this.state.content && this.state.content.teardown) {
            this.state.content.teardown();
        }
        var json = this.state.file !== 'none' ? require('./samples/' + this.state.file) : {schema: {}};
        json.output = null;
        var state = {
            loadErrors: this.state.loadErrors,
            loadData: this.state.loadData,
            file: this.state.file,
            content: json,
            data: this.state.loadData ? json.data : {},
            errors: this.state.loadErrors ? json.errors : {}
        };
        if (json.setup) {
            state._setup = json.setup();
        }
        this.setState(state);
    },


    handleData(e){
        var data = {};
        if (this.state.loadData = e.target.checked) {
            data = this.state.content.data;
        }

        this.vm.setValue(data);
    },
    handleError(e){
        var load = this.state.loadErrors = e.target.checked;
        var errors = load ? this.state.content.errors : {}
        this.vm.setErrors(errors);
        this.setState({errors: errors})
    },
    handleSubmit(e, errors, value){
        e && e.preventDefault();
        this.setState({
            alert: true,
            submitErrors: errors,
            submitValue: value
        })
    }
    ,
    hideModal(e, errors, value){
        this.setState({
            alert: false,
            submitErrors: null,
            submitValue: null

        })
    },

    render() {
        var {content, data, errors} = this.state;
        var { schema, description, title, setup, props, teardown} = (content || {});
        if (setup) {
            var tmp = setup.toString().replace(setupRe, '$1').replace(/__webpack_require__\(\d+?\)/g, 'require("subschema")').split('\n').map(function (v) {
                return v.replace(/^	        /, '');
            });
            // tmp.pop();
            // tmp.pop();
            setup = tmp.join('\n')
        }
        title =title || this.state.file.replace(/\.js(x)?/, '');
        var propsstr = '';
        Object.keys(props || {}).forEach(function (key) {
            propsstr += key + '={' + JSON.stringify(props[key]) + '} ';
        });
        return (<div>
            <div className="navbar">
                <div className="navbar-inner">
                    <div className="form-inline">
                        <select className="form-control" ref="selector" onChange={this.changeFile}
                                value={this.state.file}>
                            <option value="none">None Selected</option>
                            {samples.map((v)=> {
                                return <option key={v.name} value={v.file}>{v.name}</option>
                            })}

                        </select>

                        <label className="checkbox-inline">
                            <input type="checkbox" onChange={this.handleData}/> Load Data
                        </label>
                        <label className="checkbox-inline">
                            <input type="checkbox" onChange={this.handleError}/> Load Errors
                        </label>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row-fluid">
                    <fieldset>
                        <legend>Example - {title}</legend>
                        <p dangerouslySetInnerHTML={{__html: description || ''}}/>

                        <div className="span10">
                            <div className="container-fluid">
                                <div className="row-fluid">
                                    <div className="span12">
                                        <Form ref="form" schema={ schema} value={ data}
                                              errors={ errors }
                                              valueManager={this.vm}
                                              onSubmit={this.handleSubmit}
                                              onValidate={this.handleErrors}
                                            {...props}
                                            />
                                    </div>
                                </div>

                        <pre>
                            <div>var Form = require('subschema').Form;</div>
                            <div>var React = require('react');</div>
                            { setup ? <div>{setup}</div> : null}
                            <div>var data = {JSON.stringify(data || {}, null, 2)};</div>
                            <div>var errors = {JSON.stringify(errors || {}, null, 2)};</div>
                            <div>var schema = {JSON.stringify(schema || {}, null, 2)};</div>


                            {'React.render(<Form value={data} schema={schema} errors={errors} ' + propsstr + '/>, document.getElementById("content"))'}

                        </pre>
                            </div>

                        </div>
                    </fieldset>
                </div>

                {
                    this.state.alert ?
                        <MyModal ref="modal" onRequestHide={this.hideModal} errors={this.state.submitErrors}
                                 value={this.state.submitValue}/> : null
                }
            </div>
        </div>);
    }

});

React.render(<App/>, document.getElementsByTagName('body')[0])
