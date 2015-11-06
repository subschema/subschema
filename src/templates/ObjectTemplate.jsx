var React = require('../React');

var ObjectTemplate = React.createClass({
    render(){

        var {children, className, fieldAttrs, ...props} = this.props;
        return (<div className={className} {...fieldAttrs}>
            {children}
        </div>);
    }
});

module.exports = ObjectTemplate;