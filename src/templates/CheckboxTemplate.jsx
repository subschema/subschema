var React = require('../react');
var Content = require('../types/Content.jsx');
var style = require('./CheckboxTemplate-style');
var CheckboxTemplate = React.createClass({
    render(){
        return (<div className={style.checkbox}>
            <label>
                {this.props.children}
                {this.props.label}
            </label>
        </div>);
    }
});

module.exports = CheckboxTemplate;