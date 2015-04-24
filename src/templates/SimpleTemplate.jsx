var React = require('../react');
var SimpleTemplate = React.createClass({
    render(){
        var {name, title, help, errorClassName, message, fieldClass, children} = this.props;
        return (<div className="form-group">
            <label for={name}>{title}</label>
            {this.props.children}
        </div>);
    }
});
module.exports = SimpleTemplate;