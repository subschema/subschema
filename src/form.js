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
    componentWillMount(){
        var p = ['schema'];
        if (this.props.path) {
            p.unshift(this.props.path);
        }
        this._listener = this.props.valueManager.addStateListener(p.join('.'), this.handleState, this, false);
    },
    componentWillUnmount(){
        this._listener.remove();
    },
    handleState(value, path){
        var parts = path.split('.'), root = this.schema[parts.shift()];

        do {
            var key = parts.shift();
            if (parts.length) {
                if (root[key] == null) {
                    root = (root[key] = {});
                } else {
                    root = root[key];
                }
            } else {
                root[key] = value;
            }
        } while (parts.length);
        this.schema = NestedMixin.normalizeSchema(this.schema, this.props.loader);
        this.setState({'_now': Date.now()});
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