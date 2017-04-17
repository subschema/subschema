/**
 * Register a fake loader.
 * @type {{fetch: Function, format: Function}}
 */
loader.addProcessor('fakeAjax', {
    fetch: function (url, value, component, cb) {
        //You can fire an ajax request here.
        var ti = setTimeout(function () {
            var ret = [];
            for (var i = 0; i < (10 - value.length); i++) {
                ret.push({
                    val: i,
                    label: value + ' ' + i
                });
            }

            //callback err, value.
            cb(null, ret);
        }, 200);
        return {
            cancel: function () {
                //You could abort an AJAX request here.
                clearTimeout(ti);
            }
        }

    },
    value: function (obj) {
        return obj && obj.val;
    },
    format: function (value) {
        return value && value.label;
    }
});