"use strict";
var React = require('../React');
var Content = require('../types/Content.jsx');
var styles = require('subschema-styles/RadioItemTemplate-style');
var RadioItemTemplate = React.createClass({

    render(){
        var {label, labelHTML, checked, checkedClass, id} = this.props;


        label = labelHTML ? labelHTML : label;
        checkedClass = checkedClass || '';
        label = typeof label === 'string' ? [{children: true}, label] : label;

        return (<div className={styles.namespace+' '+(checked ? checkedClass || styles.checked : styles.unchecked)}>
            <Content type='label' content={label}>
                {this.props.children}
            </Content>
        </div>);
    }
});
module.exports = RadioItemTemplate