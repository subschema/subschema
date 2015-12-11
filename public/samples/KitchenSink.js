var loader = require('subschema').loader, schema = {};
loader.listTypes().forEach(function (type) {
    schema[type.name] = {
        type: type.name,
        fieldClass: 'row'
    }
});

module.exports = {
    description: "All the components with no options passed, just a place to make sure everything is here.   This may not be a good idea.",
    schema: {
        schema
    }

};