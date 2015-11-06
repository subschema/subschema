var React = require('../React');
var FieldValueMixin = require('../FieldValueMixin');
var css = require('../css');
var Constants = require('../Constants')
var makeFormatter = require('../formatter');
function ret(op) {
    return op;
}
var dateRe = /^([0,1]?\d?)(?:\/?(\d{0,2}))?$/;
var zipRe = /^(\d{0,5})(?:[^\d]?(\d{0,4}))?$/;
function lastEq(input, val) {
    return input && input[input.length - 1] === val;
}

function defaultValidator(value, regex) {
    return regex.test(value);
}
function createValidator(validator, loader) {
    if (validator === void(0)) {
        return defaultValidator;
    }
    if (typeof validator === 'function') {
        return validator;
    }
    if (typeof validator === 'string') {
        validator = loader.loadValidator(validator)();
        return function (value) {
            return !validator(value)
        }
    }
    if (validator instanceof RegExp) {
        return RegExp.prototype.test.bind(re)
    }
    throw 'Do not know what to do with ' + validator;


}
function title(value) {
    value = value || '';
    if (value.length === 0) {
        return value;
    }
    return value.substring(0, 1).toUpperCase() + value.substring(1);
}
var Restricted = React.createClass({
    mixins: [require('./RestrictedMixin')],
    componentWillReceiveProps(newProps){
        if (this.props.value !== newProps.value) {
            this._value(newProps.value);
        }

    },
    render(){
        var {onChange, onValueChange, onBlur, className,field,value, dataType, value, type, fieldAttrs, ...props} = this.props
        return <input ref="input" onBlur={this.handleValidate} onChange={this.handleValueChange} id={this.props.name}
                      className={css.forField(this)}
                      value={this.state.value}
            {...props} {...fieldAttrs} type={dataType || 'text'} onKeyDown={this.handleKeyDown}/>
    }
});

module.exports = Restricted;