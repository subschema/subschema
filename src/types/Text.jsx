var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants'), css = require('../css');


var TextInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        var {onChange,onBlur, className,field,value, dataType, value, fieldAttrs, ...props} = this.props
        return <input ref="input" onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={css.forField(this)}
                      type={dataType || 'text'}
                      value={this.state.value}
                      {...props} {...fieldAttrs} />
    }
});

module.exports = TextInput;