"use strict";
import React, {Component} from '../React';
import css from '../css';
import Constants from '../Constants'
import makeFormatter from '../formatter';
import PropTypes from '../PropTypes';

var zipRe = /^(\d{0,5})(?:[^\d]?(\d{0,4}))?$/;
function lastEq(input, val) {
    return input && input[input.length - 1] === val;
}

function defaultValidator(value, regex) {
    return regex.test(value);
}
var dd_yyyy = makeFormatter('##/####');

function shortDate(value, isBackspace, caret) {
    var ref = dd_yyyy(value, isBackspace, caret),
        parts = /(\d{1,2})([^\d]+?)?(\d{0,4})?/.exec(value),
        position = ref.position,
        str = '',
        [whole, mm, delim, last] = parts,
        mmInt = parseInt(mm || '0', 10);

    //invalid month, best guess

    if (!isBackspace) {
        //13->01/3
        if (parseInt(mm, 10) > 12) {
            str = '0' + mm[0] + '/';
            last = mm[1] + (last == null ? '' : last);
        } else
        //11->11/
        if (delim) {
            str = (mmInt < 10 ? '0' + mmInt : mmInt) + '/';
        } else if (mmInt > 9) {
            str = mmInt + '/';
        } else if (mmInt > 1) {
            str = '0' + mmInt + '/';
        } else if (mm.length === 2) {
            str = mm + '/';
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
    } else {
        str = ref.value;
    }
    var isValid = false;
    if (str.length === 7) {
        isValid = true;
        var parts = str.split('/');
        parts.push(parts.pop().replace(/^20/, ''));
        str = parts.join('/');
    } else {
        str = str.substring(0, 7);
    }
    return {
        value: str,
        isValid,
        position
    };

};
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
    if (value.length === 0) {
        return value;
    }
    return value.substring(0, 1).toUpperCase() + value.substring(1);
}
export default class RestrictedMixin extends Component {
    static inputClassName = Constants.inputClassName
    static formatters = {
        uszip(value, isBackspace, position){
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
        capitalize(value, isBackward, position) {
            value = value || '';
            var isValid = value && value.length > 2 || false;
            if (isBackward) {
                position--;
            } else {
                position++;
                value = title(value);
            }
            return {
                value,
                isValid,
                position
            };
        },
        title(value, isBackward, position){
            value = value || '';
            var isValid = value && value.length > 2 || false;
            if (isBackward) {
                position--;
            } else {
                value = value.replace(/([^\s]*)(\s*)/g, title);
                position++;
            }
            return {
                value,
                isValid,
                position
            }
        },
        creditcard: '#### #### #### ####',
        mm20YY: shortDate,
        shortDate
    }

    constructor(props, ...rest){
        super(props, ...rest);
        if (props && props.value) {
            var value = this.props.value ? this.formatter(this.props.value) : {
                isValid: false,
                value: ''
            };
            if (!this.state) {
                this.state = {};
            }
            this.state.value = value.value || '';
            this.state.hasValidValue = value.isValid;
        }

    }


    formatter(value, isBackspace, caret) {
        if (this._formatter) {
            return this._formatter.call(this, value, isBackspace, caret);
        }
        var formatter = this.props.formatter;

        if (typeof formatter === 'string') {
            formatter = RestrictedMixin.formatters[formatter] || formatter;
            if (typeof formatter === 'function') {
                return (this._formatter = formatter).call(this, value, isBackspace, caret);
            } else {
                return (this._formatter = makeFormatter(formatter, createValidator(this.props.validator, this.context.loader))).call(this, value, isBackspace);
            }
        } else if (typeof formatter === 'function') {
            return (this._formatter = formatter).call(this, value, isBackspace, caret);
        }
        return value;
    }
    handleKeyDown = (e) => {
        if (this.props.onKeyDown) {
            this.props.onKeyDown.call(this, e);
        }
        var pos = e.target.selectionStart, end = e.target.selectionEnd, value = (this.state.value || '');
        if (e.key === 'Enter') {
            this.props.onValid(this.state.hasValidValue, {
                isValid: this.state.hasValidValue,
                value: this.state.value
            });
            return;
        }
        if (e.key === 'Delete') {
            e.preventDefault();
            value = value.substring(0, pos) + value.substring(end);
            this._value(value, false, pos);
            return;
        }
        if (e.key === 'Backspace') {
            e.preventDefault();
            e.stopPropagation();
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
        if (e.key !== 'Unidentified') {
            return;
        }
        /* if (e.key === 'Shift'){
         this._shift = true;
         return
         }
         */
        if (pos < value.length) {
            e.preventDefault();
            e.stopPropagation();
            var nvalue = value.split('');
            var char = String.fromCharCode(e.keyCode);
            if (!e.shiftKey) {
                char = char.toLowerCase();
            }
            nvalue.splice(pos, Math.max(end - pos, 1), char);
            this._value(nvalue.join(''), false, pos);
        }
    }
    _value(str, isBackspace, caret){
        var value = this.formatter(str, isBackspace, caret) || {isValid: false};

        this.props.onValid(value.isValid, value);
        this.triggerChange(value.value);
        if (caret != null && typeof value.position === 'number') {
            if (isBackspace) {
                caret += value.position - 1;
            }
            else {
                caret = value.position;
            }
        }
        this.setState({
            value: value.value,
            hasValue: value.value.length !== 0,
            hasValidValue: value.isValid
        }, this.handleSelectionRange);

    }
    handleValueChange = (e)=>{
        this.props.onChange.call(this, e);
        this._value(e.target.value, false);
    }
}