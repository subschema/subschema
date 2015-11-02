"use strict";

var React = require('./react');
var NestedMixin = require('./NestedMixin');
var PropTypes = require('./PropTypes');
var ValueManager = require('./ValueManager');
var _set = require('lodash/object/set');
var FormInner = React.createClass({
    mixins: [NestedMixin]
});
var Form = React.createClass({
    displayName: 'Form',
    childContextTypes: {
        valueManager: PropTypes.valueManager,
        loader: PropTypes.loader
    },

    getChildContext() {
        var {valueManager, loader, value, errors} = this.props;
        if (loader == null) {
            loader = require('./loader.js');
        }
        if (valueManager === null) {
            valueManager = ValueManager(value, errors);
        }
        return {
            valueManager, loader
        };
    },

    propTypes: {
        schema: PropTypes.schema.isRequired,
        loader: PropTypes.loader,
        valueManager: PropTypes.valueManager,
        template: PropTypes.template,
        method: PropTypes.string,
        action: PropTypes.string,
        enctype: PropTypes.string,
        onSubmit: PropTypes.event,
        noValidate: PropTypes.bool
    },
//    mixins: [NestedMixin],
    getDefaultProps() {
        return {
            template: 'FormTemplate',
            onSubmit(e){
            },
            noValidate: false,
            valueManager: ValueManager()
        }
    },
    componentWillMount(){
        if (this.props.value) {
            this.props.valueManager.setValue(this.props.value);
        }
        if (this.props.errors) {
            this.props.valueManager.setErrors(this.props.errors);
        }
        var p = ['schema'];
        if (this.props.path) {
            p.unshift(this.props.path);
        }
        this._stateListener = this.props.valueManager.addStateListener(p.join('.'), this.handleState, this, false);
    },
    componentWillReceiveProps(newProps){
        if (this.props.value !== newProps.value) {
            this.props.valueManager.setValue(newProps.value);
        }
        if (this.props.errors !== newProps.errors) {
            this.props.valueManager.setErrors(newProps.errors);
        }
    },
    componentWillUnmount(){
        this._stateListener.remove();
    },
    handleState(value, path){
        _set(this, path, value);
        this.forceUpdate();
    },
    getValue(){
      return this.props.valueManager.getValue();
    },
    handleSubmit(e){
        e && e.preventDefault();
        var vm = this.props.valueManager;
        if (!this.props.novalidate) {
            vm.validate();
        }
        if (vm.onSubmit(e, vm.getErrors(), vm.getValue(), this.props.path) !== false) {
            this.props.onSubmit(e, vm.getErrors(), vm.getValue());
        }
    },
    setErrors(errors){
        this.props.valueManager.setErrors(errors);
    },
    render(){

        var {valueManager, loader, ...props} = this.props;
        return <FormInner ref="form" {...props} onSubmit={this.handleSubmit}/>
    }

});
module.exports = Form;