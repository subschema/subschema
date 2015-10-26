var React = require('../react');
var Content = require('../types/Content.jsx');
var RadioItemTemplate = React.createClass({

    render(){
        var {label, labelHTML, checked, checkedClass, id} = this.props;


        label = labelHTML ? labelHTML : label;
        checkedClass = checkedClass || '';
        label = typeof label === 'string' ? [{children: true}, label] : label;

        return (<div className={"radio "+(checked ? checkedClass : '')}>
            <Content type='label' content={label}>
                {this.props.children}
            </Content>
        </div>);
    }
});
module.exports = RadioItemTemplate