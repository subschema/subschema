var api = {
    inputClassName: 'form-control',
    listClassName: 'edit-list list-group',
    clz: function () {
        var str = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            if (arguments[i] != null) {
                str.push(arguments[i])
            }
        }
        return str.join(' ');
    }
};


module.exports = api;