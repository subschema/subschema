var React = require('react'), FieldMixin = require('../FieldMixin.jsx'), Constants = require('../Constants');


var DateInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        return <input onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={Constants.clz(DateInput.inputClassName, this.props.editorClass)} type="date"
                      value={this.getValue()}
                      title={this.props.title} placeholder={this.props.placeholder}/>
    }
});

module.exports = DateInput;