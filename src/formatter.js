var reRe = /((#*)(A*)(a*)([^#Aa]*))?/g;
var slice = Function.call.bind(Array.prototype.slice);

function makeFormatter(format) {
    var parts;
    var pattern = '', validPattern = '';
    var delims = [];
    var i = 0;
    reRe.lastIndex = 0;
    while ((parts = reRe.exec(format)) != null && parts.index < format.length) {
        console.log('parts', parts);
        var first = parts[2], delim = parts[5];
        if (first && first[0] === '#') {
            pattern += '(\\d{0,' + first.length + '})?';
            validPattern += '(\\d{' + first.length + '})';
        }
        if (delim) {
            pattern += '(?:(' + delim + '))?';
            validPattern += '(?:(' + delim + '))';
            delims[i] = delim;
        }

        i++
    }
    console.log('pattern', pattern);

    var re = new RegExp(pattern, 'g'), vre = new RegExp('^' + validPattern + '$', 'g');
    return function makeFormatter$formatter(input, isBackward) {
        vre.lastIndex = re.index = re.lastIndex = 0;
        var value = '';
        var parts = re.exec(input);
        parts.shift();

        for (var i = 0, d = 0, l = parts.length; i < l; i++) {
            value += (parts[i]) || ( !(isBackward && parts[i + 1] === void(0)) && delims[d++]) || '';

        }
        console.log('value', value);
        return {
            isValid: vre.test(value),
            value
        }
    }
}
module.exports = makeFormatter;