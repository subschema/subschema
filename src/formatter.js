var reRe = /(#{1,}|A{1,}|a{1,}|0{1,}(?:\.0{1,})?)?(.+?)?/mg;
var slice = Function.call.bind(Array.prototype.slice);
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
        if (!isBackward && end){
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

module.exports = makeFormatter;