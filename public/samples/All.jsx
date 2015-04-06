var React = require('react');
var loader = require('subschema').loader;
var schema = {};
loader.listTypes().forEach(function (type) {
    schema[type.name] = {
        type: type.name,
        fieldClass:'row'
    }
});

module.exports =  {

    schema: {
        schema
    }

};