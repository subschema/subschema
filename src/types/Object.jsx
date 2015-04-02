"use strict";


var React = require('react');
var NestedMixin = require('../NestedMixin.jsx');

var ObjectInput = React.createClass({
    mixins: [NestedMixin],
    displayName:'ObjectInput',
    render() {

        var {field, ...props} = this.props;
        this.schema = field.subSchema ? {schema: field.subSchema , fields: field.fields} : null;

        return <div {...props}>{this.schema && this.schema.schema ? this.renderSchema(this.props.form) : null}</div>
    }

});
module.exports = ObjectInput;