"use strict";


var React = require('react');
var NestedMixin = require('../NestedMixin.jsx');
var loader = require('../loader.jsx');

var ObjectInput = React.createClass({
    mixins: [NestedMixin],
    displayName: 'ObjectInput',
    getDefaultProps(){
        return {
            template: 'ObjectTemplate'
        }
    },

    render() {

        var {field, value,  template, ...props} = this.props;
        this.schema = field.subSchema ? {schema: field.subSchema, fields: field.fields} : null;

        var obj = {};
        obj.value = this.getValue();
        var Template = loader.loadTemplate(template);
        return <Template {...obj} {...props}>{this.schema && this.schema.schema ? this.renderSchema(this.props.form) : null}</Template>
    }

});
module.exports = ObjectInput;