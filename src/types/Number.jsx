var React = require('../react'), Constants = require('../Constants'), css = require('../css'),
    noRe = /^(-|\+)?([0-9]*\.)?$/, numRe = /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/;

var Number = React.createClass({
    mixins: [require('../BasicFieldMixin'), require('../FieldValueDefaultPropsMixin'), require('../FieldStateMixin')],
    statics: {
        inputClassName: Constants.inputClassName
    },
    handleChange(e) {
        var value = e.target.value;
        this.props.onChange(e);
        //Not a valid number but valid to become a number
        if (noRe.test(value)) {
            this.setValue(value);
        } else
        //check if real actual numbers.
        if (numRe
                .test(value)) {
            if (this.props.valueManager.update(this.props.path, parseFloat(value)) !== false) {
                this.props.onValueChange(value);
            }
        }
    },
    handleValidate(e){
        this.props.onBlur.call(this, e);
        this.props.onValidate(this.state.value, this, e);

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

module.exports = Number;
