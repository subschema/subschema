"use strict";

var React = require('../react'), Constants = require('../Constants'), css = require('../css'),
    noRe = /^(-|\+)?([0-9]*\.)?$/, numRe = /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/;

var Number = React.createClass({
    mixins: [require('../BasicFieldMixin'), require('../FieldValueDefaultPropsMixin'), require('../FieldStateMixin')],
    statics: {
        inputClassName: Constants.inputClassName
    },
    handleChange(e){

        var value = e.target.value;
//        this.props.onChange(e);
        //Not a valid number but valid to become a number
        if (value === '') {
            this.triggerChange(null);
        } else if (noRe.test(value)) {
            if (/\.$/.test(value)) {
                this.triggerChange(parseFloat(value))
                this.setValue(value);
            } else {
                this.setValue(value);
            }
        } else
        //check if real actual numbers.
        if (numRe.test(value)) {
            this.triggerChange(parseFloat(value))
        } else {
            this.setState({value: this.state.value || ''});
            this.forceUpdate();
            return false;
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
