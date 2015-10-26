"use strict";

var React = require('./react');
var NestedMixin = require('./NestedMixin');
var ValueManager = require('./ValueManager');
var Form = React.createClass({
    displayName: 'Form',
    mixins: [NestedMixin],
    getDefaultProps() {
        return {
            template: 'FormTemplate',
            onSubmit(e){
            },
            noValidate: false
        }
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