"use strict";

var React = require('./react');
var NestedMixin = require('./NestedMixin');
var PropTypes = require('./PropTypes');
var ValueManager = require('./ValueManager');
var _set = require('lodash/object/set');
var Form = React.createClass({
    displayName: 'Form',
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
    mixins: [NestedMixin],
    getDefaultProps() {
        return {
            template: 'FormTemplate',
            onSubmit(e){
            },
            noValidate: false
        }
    },
    componentWillMount(){
        var p = ['schema'];
        if (this.props.path) {
            p.unshift(this.props.path);
        }
        this._stateListener = this.props.valueManager.addStateListener(p.join('.'), this.handleState, this, false);
    },
    componentWillUnmount(){
        this._stateListener.remove();
    },
    handleState(value, path){
        _set(this, path, value);
        this.forceUpdate();
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
    }
});
module.exports = Form;