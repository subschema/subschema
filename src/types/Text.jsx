var React = require('react'), FieldMixin = require('../FieldMixin.jsx'), Constants = require('../Constants');


var TextInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        return <input ref="input" onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={Constants.clz(TextInput.inputClassName, this.props.editorClass)} type={this.props.dataType}
                      value={this.getValue()}
                      data-path={this.props.path}
                      title={this.props.title} placeholder={this.props.placeholder}/>
    }
});

module.exports = TextInput;