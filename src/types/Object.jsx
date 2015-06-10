"use strict";


var React = require('../react');
var NestedMixin = require('../NestedMixin');
var BasicFieldMixin = require('../BasicFieldMixin');
var ObjectInput = React.createClass({
    mixins: [NestedMixin, BasicFieldMixin],
    displayName: 'ObjectInput',
    statics: {
        subSchema: 'SubschemaBuilder'
    },
    getDefaultProps(){
        return {
            template: 'ObjectTemplate'
        }
    },
    vm(){
        return this.props.valueManager;
    },
    render() {

        var {field, value,  template, subSchema, schema, fields, ...props} = this.props;
        schema =  subSchema || schema;
        schema = this.normalizeSchema(schema);

        this.schema = schema.schema ? schema : {schema: schema, fields };

        var obj = {};
        obj.value = this.getValue();
        var Template = this.template();
        return (
            <Template {...obj} {...props}>{this.schema && this.schema.schema ? this.renderSchema(this.props.form) : null}</Template>);
    }

});
module.exports = ObjectInput;