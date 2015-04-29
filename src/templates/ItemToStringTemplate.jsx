var React = require('../react');
var util = require('../tutils');
var ItemToStringTemplate = React.createClass({

    render(){
        var {value, labelKey} = this.props;
        if (labelKey) {
            return <span className="brf-value list-group-item-text">{value[labelKey] || ''}</span>;
        }
        return <span className="brf-value list-group-item-text">{value == null ? null : value + ''}</span>;

    }
});

module.exports = ItemToStringTemplate;