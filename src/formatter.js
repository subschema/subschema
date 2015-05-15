var reRe = /(((#*)|(0*\.0*)|(A*)|(a*))([^#Aa0]*))?/g;
var slice = Function.call.bind(Array.prototype.slice);
function fixDelim(str) {
    return str.replace(/([ ().-])/g, '\\$1');
}
function ret(exact, val, d, backward) {
    return (exact != null && exact === d) ? exact : exact == null || exact == '' ? val : exact;
}
function fmt(delim) {
    return function fmt$return(exact, val, d, backward) {
        if (exact === d) {
            return exact;
        }
        return (exact == null || exact === '' ) ? val : backward ? exact : exact + delim;
    };
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
    console.log('what?');
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
        console.log('pad handler');
        exact = ret(exact, val, d).split('.', 2);
        return _pad(exact[0], parts[0].length, false) + ( parts.length && '.' + _pad(exact[1], parts[1].length, true))
    };

}
function makeFormatter(format) {
    var parts;
    var pattern = '', validPattern = '';
    var delims = [];
    var i = 0;
    var handlers = [];
    reRe.lastIndex = 0;
    while ((parts = reRe.exec(format)) != null && parts.index < format.length) {
        var first = parts[3] || parts[4], delim = parts[7], exact;
        if (first) {

            switch (first[0]) {
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
                    handlers.push(ret);
                    break;
                }
            }
        }
        //capture all the rest
        //  pattern += '(?:.+?)?'
    }

    var re = new RegExp('^' + pattern), vre = new RegExp('^' + validPattern + '$', 'g');
    /* return function makeFormatter$formatter(input, isBackward) {
     vre.lastIndex = re.index = re.lastIndex = 0;
     var value = '';
     var parts = re.exec(input);
     parts.shift();
     while(parts[parts.length - 1 ] == null){
     parts.pop();
     }
     for (var i = 0, d = 0, l = parts.length+1; i < l; i++) {
     value += (parts[i]) || ( !((isBackward && parts[i + 1] === void(0))  ) && delims[d++]) || '';

     }
     return {
     isValid: vre.test(value),
     value
     }
     }*/
    return function makeFormatter$formatter(input, isBackward) {
        vre.lastIndex = re.index = re.lastIndex = 0;
        var idx = 0, d = 0;
        var parts = re.exec(input);
        parts.shift();
        var incr = handlers.length;
        var value = '';
        for (var i = 0, l = incr * 3; i < l; i += 3, d++) {
            if (parts[i] == '' && parts[i + 1] == null) {
                break;
            }
            value += handlers[d](parts[i], parts[i + 1], parts[i + 2], isBackward && (i + 3 !== l) ? parts[i + 3] == '' && parts[i + 4] == null : false);

        }
        return {
            isValid: vre.test(value),
            value:value
        }
    }
}
module.exports = makeFormatter;