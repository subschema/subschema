var React = require('../react');

var ObjectTemplate = React.createClass({
    render(){

        var {children, ...props} = this.props;
        return (<div {...props}>
            {children}
        </div>);
    }
});

module.exports = ObjectTemplate;