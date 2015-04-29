"use strict";


var React = require('../react');
var NestedMixin = require('../NestedMixin');
var BasicFieldMixin = require('../BasicFieldMixin');
var LoaderMixin = require('../LoaderMixin');
var ObjectInput = React.createClass({
    mixins: [NestedMixin, BasicFieldMixin, LoaderMixin],
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

        var {field, value,  template, ...props} = this.props;
        var { schema, subSchema} = field;
        schema = schema || subSchema;
        schema = this.normalizeSchema(schema);

        this.schema = schema.schema ? schema : {schema: schema, fields: field.fields};

        var obj = {};
        obj.value = this.getValue();
        var Template = this.template();
        return (
            <Template {...obj} {...props}>{this.schema && this.schema.schema ? this.renderSchema(this.props.form) : null}</Template>);
    }

});
module.exports = ObjectInput;