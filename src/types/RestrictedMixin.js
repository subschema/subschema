"use strict";

import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import warning from '../warning';

var zipRe = /^(\d{0,5})(?:[^\d]?(\d{0,4}))?$/, reRe = /(#{1,}|A{1,}|a{1,}|0{1,}(?:\.0{1,})?)?(.+?)?/mg;

function lastEq(input, val) {
    return input && input[input.length - 1] === val;
}

function fixDelim(str) {
    return (str || '').replace(/([ ().-])/g, '\\$1');
}

function ret(exact, val, d, backward) {
    return (exact != null && exact === d) ? exact : exact == null || exact == '' ? val : exact;
}

function fmt(delim, placeholder) {
    delim = delim || '';
    function fmt$return(exact, val, d, backward) {
        if (placeholder && !backward) {
            return delim;
        }
        if (exact === d) {
            return exact || '';
        }
        return (exact == null || exact === '' ) ? val : backward ? exact : exact + delim;
    };
    fmt$return.placeholder = placeholder;
    return fmt$return;
}

function upper(delim) {
    return function fmt$return(exact, val, d, backward) {
        exact = (ret(exact, val, d) || '').toUpperCase();
        return backward ? exact : exact + delim;
    };
}
function lower(delim) {
    return function fmt$return(exact, val, d, backward) {
        exact = (ret(exact, val, d) || '').toUpperCase();
        return backward ? exact : exact + delim;
    };
}
function _pad(value, length, right) {
    value = value || '';
    while (value.length < length) {
        if (right) {
            value += '0';
        } else {
            value = '0' + value;
        }
    }
    return value;
}
function pad(delim, padding) {
    var parts = padding.split('.', 2);
    return function fmt$return(exact, val, d, backward) {
        exact = ret(exact, val, d).split('.', 2);
        return _pad(exact[0], parts[0].length, false) + ( parts.length > 1 ? '.' + _pad(exact[1], parts[1].length, true) : '');
    };

}
function defaultValidator(value, regex) {
    return regex.test(value);
}
function findCharPosAfter(value, char, pos) {
    for (var i = pos, l = value.length; i < l; i++) {
        if (value[i] === char) {
            return i + 1;
        }
    }
    return value.length;
}
function makeFormatter(format, validator) {
    validator = validator || defaultValidator;
    var parts;
    var pattern = '', validPattern = '';
    var handlers = [];
    reRe.lastIndex = 0;
    while ((parts = reRe.exec(format)) != null && parts.index < format.length) {
        var first = parts[1], delim = parts[2], exact;
        switch (first && first[0] || '') {
            //mixed case
            case 'M':
            {
                exact = '(\\[a-zA-Z]{' + first.length + '})';
                pattern += exact + '|(\\[a-zA-Z]{0,' + (first.length - 1) + '})';
                validPattern += exact;
                handlers.push(fmt(delim));
                break;
            }
            //upper case
            case 'A':
            {
                exact = '(\\[A-Z]{' + first.length + '})';
                pattern += exact + '|(\\[a-zA-Z]{0,' + (first.length - 1) + '})';
                validPattern += exact;
                handlers.push(upper(delim));

                break;
            }
            //lower case
            case 'a':
            {
                exact = '(\\[A-Z]{' + first.length + '})';
                pattern += exact + '|(\\[a-zA-Z]{0,' + (first.length - 1) + '})';
                validPattern += exact;
                handlers.push(lower(delim));

                break;
            }
            //padding
            case '0':
                exact = '(\\d{' + first.length + ',})';
                pattern += '(' + exact + '|(\\d{0,}))(?:[^\\d])?';
                validPattern += exact + fixDelim(delim);
                handlers.push(pad(delim, first));
                break;

            //Number
            case '#':
            {
                var fdelim = fixDelim(delim);
                exact = '(\\d{' + first.length + '})';
                pattern += '(' + exact + '|(\\d{0,' + (first.length - 1) + '}))(?:' + fdelim + '|[^\\d]+?)?';
                validPattern += exact + fdelim;
                handlers.push(fmt(delim));
                break;
            }
            default:
            {
                //empty pattern so that the patterns
                // and the input align when its a non matching pattern
                var fdelim = fixDelim(delim);
                exact = '(' + fdelim + ')';
                pattern += '(' + fdelim + '|)()(?:' + fdelim + '|(!' + fdelim + '))?';
                validPattern += '()(' + fdelim + ')';
                handlers.push(fmt(delim, true));
                break;
            }
        }
    }
    var re = new RegExp('^' + pattern), vre = new RegExp('^' + validPattern + '$', 'g');
    return function makeFormatter$formatter(input, isBackward, end) {
        vre.lastIndex = re.index = re.lastIndex = 0;
        var idx = 0, d = 0, p, parts = re.exec(input), position = end || 0;
        parts.shift();
        //remove delimeters

        parts = re.exec(clean(parts));
        parts.shift();
        while (parts.length) {
            p = parts[parts.length - 1];
            if (p == null || p == '')
                parts.pop();
            else
                break;
        }
        var incr = handlers.length;
        var value = '', done = false;
        for (var i = 0, l = incr * 3; i < l; i += 3, d++) {

            /*if (parts[i] == '' && parts[i + 1] == null) {
             break;
             }*/
            var isNextPlaceholder = (parts[i] !== parts[i + 2]) && (handlers[d + 1] && handlers[d + 1].placeholder === true);
            done = (i + 3 !== l) ? parts[i + 3] == null && parts[i + 4] == null ? isBackward ? true : !isNextPlaceholder : false : isNextPlaceholder;
            value += handlers[d](parts[i], parts[i + 1], parts[i + 2], done ? isBackward : false);
            if (done) {
                break;
            }
        }
        if (!isBackward && end) {
            position = findCharPosAfter(value, input[end], end);
        }
        return {
            isValid: validator(value, vre),
            value,
            position
        }
    }
}

//So we only care about every 3rd group.  Remove delimeters
// and such, so the next parse can have something nice to work with.
function clean(parts) {
    var p = '';
    for (var i = 0; i < parts.length; i += 3) {
        p += parts[i] || '';
    }
    return p;
}

function defaultValidator(value, regex) {
    return regex.test(value);
}
var dd_yyyy = makeFormatter('##/####');

function shortDate(value, isBackspace, caret) {
    var ref = dd_yyyy(value, isBackspace, caret),
        parts = /(\d{1,2})([^\d]+?)?(\d{0,4})?/.exec(value) || [],
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
        } else if (!mm) {
            //swallow
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
    static makeFormatter = makeFormatter;
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
    };

    constructor(props, ...rest) {
        super(props, ...rest);
        if (!this.state) {
            this.state = {};
        }
    }

    componentWillMount() {
        this._handleProps(this.props);
    }

    componentWillReceiveProps(props) {
        this._handleProps(props);
    }

    componentDidMount() {
        this.handleSelectionRange(this.state.caret);
    }

    componentDidUpdate() {
        this.handleSelectionRange(this.state.caret);
    }

    _handleProps(props) {
        if (props && 'value' in props && props.value !== this.state.value) {
            var value = props.value ? this.formatter(props.value) : {
                isValid: false,
                value: ''
            };
            this.state.value = value.value;
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
        warning(false, 'Did not find a formatter for %s', this.props.formatter);
        return {value};
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
            //This prevents onChange from firing.
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
    };

    handleState(str, isBackspace, caret) {
        var value = this.formatter(str, isBackspace, caret) || {isValid: false};


        if (caret != null && typeof value.position === 'number') {
            if (isBackspace) {
                caret += value.position - 1;
            }
            else {
                caret = value.position;
            }
        }
        var state = this.state;
        state.caret = caret;
        state.value = value.value;
        state.hasValue = value.value != null && value.value.length !== 0;
        state.hasValidValue = value.isValid;
        /*
         this.setState({
         caret,
         value: value.value,
         hasValue: value.value != null && value.value.length !== 0,
         hasValidValue: value.isValid
         }, this.handleSelectionRange);
         */
        return value;

    }

    _value(str, isBackspace, caret) {
        var value = this.handleState(str, isBackspace, caret);
        this.props.onChange(value.value);
        this.props.onValid(value.isValid, value);
    }


}