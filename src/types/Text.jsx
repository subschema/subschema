var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants'), css = require('../css');


var TextInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        var {onChange, onValueChange, onBlur, className, field, value, dataType, value, fieldAttrs, type, ...props} = this.props
        return <input ref="input" onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={css.forField(this)}

                      value={this.state.value}
                      {...props} {...fieldAttrs}
                      type={dataType || 'text'}
            />
    }
});

module.exports = TextInput;
