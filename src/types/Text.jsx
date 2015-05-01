var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants'), css = require('../css');


var TextInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        var props = this.props, field = this.props.field;
        var opts = {
            dataType: field.dataType || props.dataType,
            title: field.title || props.title,
            placeholder: field.placeholder || props.placeholder
        }
        var attr = field.fieldAttrs || props.fieldAttrs;
        return <input ref="input" onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={css.forField(this)} type={this.props.dataType}
                      value={this.state.value}
                      data-path={this.props.path}
                      title={this.props.title} {...opts} {...attr}/>
    }
});

module.exports = TextInput;