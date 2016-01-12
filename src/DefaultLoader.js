"use strict";
var validators = require('./validators');
var templates = {},
    types = {},
    processors = {},
    templateContext = require.context("./templates", true, /Template.js(x)?$/),
    processorContext = require.context("./processors", true, /^(?!.*(index)\.js(x)?$).*\.js(x)?$/),
    typeContext = require.context("./types", true, /^(?!.*(index|Mixin)\.js(x)?$).*\.js(x)?$/);

templateContext.keys().forEach(function (path) {
    var name = path.replace(/.*\/(.*)\.js(x?)/, '$1');
    templates[name] = {
        name: name,
        path: path,
        template: templateContext(path).default
    }
});
processorContext.keys().forEach(function (path) {
    var name = path.replace(/.*\/(.*)\.js(x?)/, '$1');
    processors[name] = {
        name: name,
        path: path,
        processor: processorContext(path).default
    }

});
typeContext.keys().forEach(function (path) {
    var name = path.replace(/.*\/(.*)\.js(x?)/, '$1');
    types[name] = {
        name: name,
        path: path,
        type: typeContext(path).default
    }
});

export default {
    loadTemplate (template) {
        return templates[template] && templates[template].template;
    },
    listTemplates(){
        return Object.keys(templates).map(function (key) {
            return templates[key]
        });
    },
    loadProcessor(type){
        return processors[type] && processors[type].processor
    },
    listProcessors(){
        return Object.keys(processors).map(function (key) {
            return processors[key];
        });
    },
    loadType (type) {
        return types[type] && types[type].type;
    },
    listTypes(){
        return Object.keys(types).map(function (key) {
            return types[key]
        });
    },
    loadValidator(validator){
        return validators[validator] && validators[validator].bind(validators);
    },
    listValidators(){
        return Object.keys(validators).map(function (name) {
            var validator = validators[name];
            return {
                name, validator
            };
        });
    }

};
