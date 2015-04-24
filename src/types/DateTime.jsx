var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants');


var DateTimeInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        return <input onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={Constants.clz(DateTimeInput.inputClassName, this.props.editorClass)} type="datetime"
                      value={this.getValue()}
                      title={this.props.title} placeholder={this.props.placeholder}/>
    }
});

module.exports = DateTimeInput;