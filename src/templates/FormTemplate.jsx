var React = require('../react');
"use strict";

var FormTemplate = React.createClass({
    getDefaultProps(){
        return {
            className: 'form-horizontal'
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