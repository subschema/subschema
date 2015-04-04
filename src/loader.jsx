var templates = [],
    types = [],
    loaders = [],
    api = {
        /**
         * @param template String - looks for a template named something.
         */
        loadTemplate(template){
            var i = 0, l = loaders.length, ret = null;
            for (; i < l; i++) {
                var ret = loaders[i].loadTemplate && loaders[i].loadTemplate.apply(this, arguments);
                if (ret != null) {
                    return ret;
                }
            }
            return null;
        },
        loadType(type){
            var i = 0, l = loaders.length, ret = null;
            for (; i < l; i++) {
                var ret = loaders[i].loadType && loaders[i].loadType.apply(this, arguments);
                if (ret != null) {
                    return ret;
                }
            }
            return null;
        },

        addTemplate(name, template){
            api.addLoader({
                loadTemplate(v){
                    if (v === name) {
                        return template;
                    }
                }
            })
        },
        addType(name, template){
            api.addLoader({
                loadType(v){
                    if (v === name) {
                        return template;
                    }
                }
            })
        },
        addLoader(loader){
            loaders.unshift(loader);
        }
    };


api.addLoader({
    loadTemplate: function (template) {
        return require.context("./templates", true, /^\.\/.*\.js(x)?/)('./' + template + '.jsx');
    },
    loadType: function (type) {
        return require.context("./types", true, /^\.\/.*\.js(x)?/)('./' + type + '.jsx');
    }
});
module.exports = api;