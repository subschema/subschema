var React = require('../react'), FieldMixin = require('../FieldMixin'), Constants = require('../Constants'), css = require('../css');


var DateInput = React.createClass({
    mixins: [FieldMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    render() {
        var {onBlur,onValueChange,onChange, className, fieldAttrs, ...props} = this.props;
        return <input onBlur={this.handleValidate} onChange={this.handleChange} id={this.props.name}
                      className={css.forField(this)} type="date"
                      value={this.state.value}
            {...props}
            {...fieldAttrs}
            />
    }
});

module.exports = DateInput;