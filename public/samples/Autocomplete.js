module.exports = {
    description: 'Autocomplete adds static or dynamic autocompletion.<br/>  If options are passed than it behaves mostly like the select component',
    schema: {
        schema: {
            'simple': {
                type: 'Autocomplete',
                options: ['aaaa', 'aaab', 'aba', 'baaa', 'caaa']
            },
            'ajax': {
                type: 'Autocomplete',
                processor: 'fakeAjax'
            }
        }
    },
    data: {
        simple: 'aaaa',
        ajax: {
            val: '1',
            label: 'a 1'
        }
    },
    setup(){
        /**
         * Register a fake loader.
         * @type {{fetch: Function, format: Function}}
         */
        var fakeAjax = {
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
                    cancel(){
                        //You could abort an AJAX request here.
                        clearTimeout(ti);
                    }
                }

            },
            value(obj){
                return obj;
            },
            format: function (value) {
                return value && value.label;
            }
        };
        var loader = require('subschema').loader;
        this._loader = loader.addLoader({
            loadProcessor: function (name) {
                if (name === 'fakeAjax') {
                    return fakeAjax
                }
            },
            listProcessors: function () {
                return [{name: 'fakeAjax', processor: fakeAjax}]
            }
        });


    },
    teardown(){
        require('subschema').loader.removeLoader(this._loader);
    }
}