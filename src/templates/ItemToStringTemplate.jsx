var React = require('../React');
var util = require('../tutils');
var ItemToStringTemplate = React.createClass({

    render(){
        var {value, labelKey} = this.props;
        if (labelKey) {
            return <span className={style.label}>{value[labelKey] || ''}</span>;
        }
        return <span className={style.label}>{value == null ? null : value + ''}</span>;

    }
});

module.exports = ItemToStringTemplate;