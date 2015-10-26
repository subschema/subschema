var React = require('../react');
"use strict";

var FormTemplate = React.createClass({
    getDefaultProps(){
        return {
            className: 'form-horizontal'
        }
    },
    render(){
        var {children, className, ...props} = this.props;
        return (<form {...props} className={className}>
            {children}
        </form>);
    }
});

module.exports = FormTemplate;