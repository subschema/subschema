"use strict";

var templates = {},
    types = {},
    templateContext = require.context("./templates", true, /Template.js(x)?$/),
    typeContext = require.context("./types", true,  /^(?!.*(index|Mixin)\.js(x)?$).*\.js(x)?$/);

templateContext.keys().forEach(function (path) {
    var name = path.replace(/.*\/(.*)\.js(x?)/, '$1');
    templates[name] = {
        name: name,
        path: path,
        template: templateContext(path)
    }
});

typeContext.keys().forEach(function (path) {
    var name = path.replace(/.*\/(.*)\.js(x?)/, '$1');
    types[name] = {
        name: name,
        path: path,
        type: typeContext(path)
    }
})

//console.log('Templates', Object.keys(templates), 'Types', Object.keys(types));
module.exports = {
    loadTemplate (template) {
        return templates[template] && templates[template].template;
    },
    listTemplates(){
        return Object.keys(templates).map(function (key) {
            return templates[key]
        });
    },
    loadType (type) {
        return types[type] && types[type].type;
    },
    listTypes(){
        return Object.keys(types).map(function (key) {
            return types[key]
        });
    }
}
