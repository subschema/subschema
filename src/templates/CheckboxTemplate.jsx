var React = require('../react');

var CheckboxTemplate = React.createClass({
    render(){
        return (<div className="checkbox">
            <label>
                {this.props.children}
                {this.props.label}
            </label>
        </div>);
    }
});

module.exports = CheckboxTemplate;