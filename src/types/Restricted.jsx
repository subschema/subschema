var React = require('../react');
var FieldValueMixin = require('../FieldValueMixin');
var css = require('../css');
var Constants = require('../Constants')
var makeFormatter = require('../formatter');
function ret(op) {
    return op;
}
var cardRe = /^(\d{0,4})(?:[^\d]?(\d{0,4}))(?:[^\d]?(\d{0,4}))(?:[^\d]?(\d{0,4}))$/;
var dateRe = /^([0,1]?\d?)(?:\/?(\d{0,2}))?$/;
var zipRe = /^(\d{0,5})(?:[^\d]?(\d{0,4}))?$/;
var reRe = /(#*)?(A*)?(a*)?([^#Aa]*)?/g;
function lastEq(input, val) {
    return input && input[input.length - 1] === val;
}
var Restricted = React.createClass({
    mixins: [FieldValueMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    getInitialState(){
        return {
            value: this.props.value || ''
        }
    },
    formatters: {
        uszip(value){
            value = (value || '').substring(0, 10);
            var parts = zipRe.exec(value) || [], stateValue = this.state.value || '', isBackspace = stateValue.length > value.length, hasValidValue = false;

            if (parts) {
                if (parts[2]) {
                    value = parts[1] + '-' + parts[2]
                } else {
                    value = parts[1];
                }
                hasValidValue = value.length === 5 || value.length === 10;

            } else {
                value = '';
            }

            return {
                value,
                hasValidValue
            }
        },
        creditcard(value){

            var parts = cardRe.exec(value) || [], stateValue = this.state.value || '', isBackspace = stateValue.length > value.length;
            value = (value || '').replace(/\s+?/g, '');
            if (parts.shift()) {
                var str = '';
                var last = parts.pop();
                parts.forEach(function (v) {
                    if (v !== '') {
                        if (v.length === 4) {
                            str += v + ' '
                        } else {
                            str += v;
                        }
                    }
                });
                str += (last || '');
                return {
                    value: (isBackspace) ? str.substring(0, (lastEq(stateValue, ' ') ? stateValue.length - 1 : stateValue.length)) : str,
                    isValid: str.length === 19
                }
            }
            if (value && value.trim() === '') {
                return {value: value.trim(), isValid: true};
            }
            return {
                value: '',
                isValid: true
            }
        },
        shortDate(value){
            var parts = dateRe.exec(value) || [], stateValue = this.state.value || '', isBackspace = stateValue.length > value.length;
            if (parts.shift()) {
                var str = '';
                var last = parts.pop();
                var mm = parts.shift();
                if (mm.length === 2) {
                    str += mm + '/'
                } else if (last || last === '') {
                    str += '0' + mm + '/'
                } else {
                    str += mm;
                }
                str += (last || '');
                return {
                    value: (isBackspace) ? str.substring(0, (lastEq(value, '/') ? value.length - 1 : value.length)) : str,
                    isValid: str.length === 5
                };
            }
            if (value && value.trim() === '') {
                return {
                    value: value.trim(),
                    isValid: false
                }
            }
            return {
                value: '',
                isValid: false
            }
        }
    },
    makeFormatter: function (format) {
        return makeFormatter(format);
    },
    formatter: function (value) {
        var field = this.props.field;
        var formatter = field.formatter || this.props.formatter;

        if (typeof formatter === 'string') {
            if (this.formatters[formatter]) {
                return (this._formmater = this.formatters[formatter]).call(this, value);
            } else {
                return (this._formatter = this.makeFormatter(formatter)).call(this, value);
            }
        } else if (typeof formatter === 'function') {
            return (this._formatter = formatter).call(this, value);
        }
        return value;
    },
    handleKeyDown(e){
        if (e.key === 'Delete') {
            e.preventDefault();
            var pos = e.target.selectionStart, end = e.target.selectionEnd;
            var value = (this.state.value || '');
            value = value.substring(0, pos) + value.substring(end);
            value = this.formatter(value);
            this.props.onValid(value.isValid, value);
            this.setState({
                value: value.value,
                hasValue: value.value.length > 0,
                hasValidValue: value.isValid
            })
            return;
        }
        if (e.key === 'Backspace') {
            e.preventDefault();
            var value = (this.state.value || '');
            var pos = e.target.selectionStart, end = e.target.selectionEnd;
            if (pos === end) {
                value = this.formatter(value.trim().substring(0, value.length - 1));
            } else {
                value = this.formatter(value.substring(0, pos) + value.substring(end));
            }
            this.props.onValid(value.isValid, value);
            this.setState({
                value: value.value,
                hasValue: value.value.length > 0,
                hasValidValue: value.isValid
            })
            return;
        }
    },

    handleValueChange(e){
        var value = this.formatter(e.target.value.trim());
        if (value.value) {
            this.props.onValid(value.isValid, value);
            this.setState({
                value: value.value,
                hasValue: value.value.length !== 0,
                hasValidValue: value.isValid
            });
        }
    },
    render(){
        var field = this.props.field;
        var autoFocus = field && field.autoFocus || this.props.autoFocus;
        var placeholder = field && field.placeholder || this.props.placeholder;
        if (autoFocus) {
            autoFocus = {autoFocus}
        }
        return <input type="text" value={this.state.value}
                      className={css.forField(this)}
                      onChange={this.handleValueChange}
                      onFocus={this.props.onFocus}
                      onBlur={this.props.onBlur}
                      onKeyDown={this.handleKeyDown}
            {...{placeholder}}
            {...autoFocus}
            />;
    }
});

module.exports = Restricted;