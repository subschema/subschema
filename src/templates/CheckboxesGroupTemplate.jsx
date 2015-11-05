var React = require('../react');
var style = require('subschema-styles/CheckboxesGroupTemplate-style');
var CheckboxesGroupTemplate = React.createClass({
    render(){
        return (<fieldset className={style.group}>
            <legend>{this.props.group}</legend>
            {this.props.children}
        </fieldset>);
    }
});
module.exports = CheckboxesGroupTemplate;