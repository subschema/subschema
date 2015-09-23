"use strict";
var React = require('../react');
var mixins = [require('../NestedMixin'), require('../BasicFieldMixin')];

var ObjectInput = React.createClass({
    mixins,
    getDefaultProps(){
        return {
            template: 'ObjectTemplate'
        }
    },
    vm(){
        return this.props.valueManager;
    },
    render() {

        var {fieldsets,value,  template, subSchema, schema, fields, ...props} = this.props;
        var obj = {};
        obj.value = this.getValue();
        var Template = this.template();
        return (
            <Template {...obj} {...props}>{this.schema && this.schema.schema ? this.renderSchema(this.schema) : null}</Template>);
    }

});
module.exports = ObjectInput;