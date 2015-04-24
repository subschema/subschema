var loader = require('./loader');

loader.addLoader({
    loadTemplate (template) {
        return require.context("./templates", true, /^\.\/.*\.js(x)?/)('./' + template + '.jsx');
    },
    listTemplates(){

        return require.context("./templates", true, /^\.\/.*Template\.js(x)?/).keys().map(function (k) {
            return {
                name: k.replace(/.*\/(.*)\.js(x?)/, '$1'),
                path: k
            }
        });
    },
    loadType (type) {
        return require.context("./types", true, /^\.\/.*\.js(x)?/)('./' + type + '.jsx');
    },
    listTypes(){
        return require.context("./types", true, /^\.\/.*\.js(x)?/).keys().map(function (k) {
            return {
                name: k.replace(/.*\/(.*)\.js(x?)/, '$1'),
                path: k
            }
        }).filter(function (v) {
            return !/Mixin$/.test(v.name);
        });
    },
    loadValidator(validator){
        var validators = require('./validators');
        return validators[validator] && validators[validator].bind(validators);
    },
    listValidators(){
        var validators = require('./validators');
        return Object.keys(validators).map(function (name) {
            var validator = validators[name];
            return {
                name, validator
            };
        });
    }
});

module.exports = loader;
