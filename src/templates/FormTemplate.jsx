"use strict";
var React = require('../react');
var styles = require('subschema-styles/FormTemplate-style');

var FormTemplate = React.createClass({
    getDefaultProps(){
        return {
            className: styles.formClass
        }
    },
    render(){
        var {children, name, fieldAttrs, encoding, className, action, method, onSubmit, ...props} = this.props;
        return (<form name={name} action={action} method={method} onSubmit={onSubmit} className={className} {...fieldAttrs}>
            {children}
        </form>);
    }
});

module.exports = FormTemplate;