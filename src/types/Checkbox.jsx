var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants');


var Checkbox = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: ''//Constants.inputClassName
    },
    doChange: function (e) {
        var hasProp = 'value' in this.props;
        this.updateValue(e.target.checked ? hasProp ? this.props.value : true : hasProp ? null : false);
    },
    render() {
        return <input onBlur={this.handleValidate} onChange={this.doChange} id={this.props.name}
                      className={ Constants.clz(Checkbox.inputClassName, this.props.editorClass)} type="checkbox"
                      value={this.state.value}
                      checked={this.state.value}
                      title={this.props.title}/>
    }
});

module.exports = Checkbox;