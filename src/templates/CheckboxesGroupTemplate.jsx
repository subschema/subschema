var React = require('../react');
var CheckboxesGroupTemplate = React.createClass({
    render(){
        return (<fieldset className="group">
            <legend>{this.props.group}</legend>
            {this.props.children}
        </fieldset>);
    }
});
module.exports = CheckboxesGroupTemplate;