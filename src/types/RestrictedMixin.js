var React = require('../react');
var FieldValueMixin = require('../FieldValueMixin');
var css = require('../css');
var Constants = require('../Constants')
var makeFormatter = require('../formatter');
function ret(op) {
    return op;
}
var dateRe = /^([0,1]?\d?)(?:\/?(\d{0,2}))?$/;
var date4yRe = /^([0,1]?\d?)([^\d])?(2?0?\d{0,2})?$/;

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
var RestrictedMixin = {
    mixins: [require('../BasicFieldMixin'), require('../FieldValueDefaultPropsMixin'), require('../FieldHandleValueMixin')],
    statics: {
        inputClassName: Constants.inputClassName
    },
    getInitialState(){
        var value = this.props.value ? this.formatter(this.props.value) : {
            isValid: false,
            value: ''
        };

        return {
            value: value.value || '',
            hasValidValue: value.isValid
        }
    },
    setValue(value){
        this.setState({value});
    },
    getValue(){
        return this.state.value;
    },
    formatters: {
        uszip(value, isBackspace){
            value = (value || '').substring(0, 10);
            var parts = zipRe.exec(value) || [], isValid = false;

            if (parts) {
                if (parts[2]) {
                    value = parts[1] + '-' + parts[2]
                } else {
                    value = parts[1] || '';
                }
                isValid = value.length === 5 || value.length === 10;

            } else {
                value = '';
            }

            return {
                value,
                isValid
            }
        },
        capitalize(value) {
            return {value: title(value), isValid: (value && value.length > 2)};
        },
        title(value, isBackspace){
            value = (value || '').split(/\s+?/).map(title).join(' ');

            return {value, isValid: (value && value.length > 2)};
        },
        creditcard: '#### #### #### ####',
        mm20YY(value, isBackspace){
            var parts = date4yRe.exec(value) || [];
            if (parts.shift()) {
                var str = '';
                var [mm,delim, last] = parts;
                //invalid month, best guess
                if (parseInt(mm, 10) > 12) {
                    str = '0' + mm[0] + '/';
                } else {
                    //otherwise
                    if (!last && mm.length === 1 && parseInt(mm, 10) > 1) {
                        str += '0' + mm + '/';
                    } else if (mm.length === 2) {
                        str = mm + '/';
                    } else if (last) {
                        str += '0' + mm + '/';
                    } else if (delim) {
                        str = mm.length === 1 ? '0' + mm + '/' : mm + '/';
                    } else {
                        str = mm;
                    }

                    if (last) {
                        last = parseInt(last, 10);
                        if (last === 2) {
                            str += '2';
                        } else if (last < 2) {
                            str += '20' + last;
                        } else if (last === 20) {
                            str += '20';
                        } else if (last < 21) {
                            str += '20' + last;
                        } else if (last > 100) {
                            str += last;
                        } else if (last > 10) {
                            str += '20' + last;
                        }
                    }
                }
                var isValid = false;
                if (str.length === 7) {
                    isValid = true;
                    var parts = str.split('/');
                    parts.push(parts.pop().replace(/^20/, ''));
                    str = parts.join('/');
                }
                return {
                    value: (isBackspace) ? str.substring(0, (lastEq(value, '/') ? value.length - 1 : value.length)) : str,
                    isValid
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
        },
        shortDate(value, isBackspace){
            var parts = dateRe.exec(value) || [];
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

    formatter: function (value, isBackspace) {
        if (this._formatter) {
            return this._formatter.call(this, value, isBackspace);
        }
        var formatter = this.props.formatter;

        if (typeof formatter === 'string') {
            formatter = this.formatters[formatter] || formatter;
            if (typeof formatter === 'function') {
                return (this._formatter = formatter).call(this, value, isBackspace);
            } else {
                return (this._formatter = makeFormatter(formatter, createValidator(this.props.validator, this.props.loader))).call(this, value, isBackspace);
            }
        } else if (typeof formatter === 'function') {
            return (this._formatter = formatter).call(this, value, isBackspace);
        }
        return value;
    },
    valueFromEvt: function (e) {
        return e.target.value;
    },
    handleKeyDown(e){
        if (this.props.onKeyDown) {
            this.props.onKeyDown.call(this, e);
        }
        var pos = e.target.selectionStart, end = e.target.selectionEnd;
        if (e.key === 'Enter') {
            this.props.onValid(this.state.hasValidValue, {
                isValid: this.state.hasValidValue,
                value: this.state.value
            });
            return;
        }
        if (e.key === 'Delete') {
            e.preventDefault();
            var value = (this.state.value || '');
            value = value.substring(0, pos) + value.substring(end);
            this._value(value, false, pos);
            return;
        }
        if (e.key === 'Backspace') {
            e.preventDefault();
            e.stopPropagation();
            var value = (this.state.value || '');
            var back = false;
            if (pos === end) {
                value = value.trim().substring(0, value.length - 1);
                back = true;
            } else {
                value = value.substring(0, pos) + value.substring(end);
            }
            this._value(value, back, pos + value.length);
            return;
        }
    },
    _value(str, isBackspace, caret){
        var value = this.formatter(str, isBackspace) || {isValid: false};
        this.props.onValid(value.isValid, value);
        this.props.handleChange(value.value);
        if (caret != null) {
            if (isBackspace) {
                caret += value.position - 1;
            } else {
                caret += value.position + 1;
            }
        }
        this.setState({
            value: value.value,
            hasValue: value.value.length !== 0,
            hasValidValue: value.isValid
        }, caret ? function () {
            this.getDOMNode().setSelectionRange(caret, caret);
        } : null);

    },
    handleValueChange(e){
        this.props.onChange.call(this, e);
        this._value(e.target.value, false, e.target.selectionEnd);
    }
};

module.exports = RestrictedMixin;