var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants'), css = require('../css');


var Checkbox = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: ''//Constants.inputClassName,
    },
    doChange: function (e) {
        var hasProp = 'value' in this.props;
        this.props.onValueChange(e.target.checked ? hasProp ? this.props.value : true : hasProp ? null : false);
    },
    render() {
        return <input onBlur={this.handleValidate} onChange={this.doChange} id={this.props.name}
                      className={ css.forField(this)} type="checkbox"
                      value={this.state.value}
                      checked={this.state.value}
                      title={this.props.title}/>
    }
});

module.exports = Checkbox;