import loaderFactory from 'subschema-loader';
const loader = loaderFactory();
loader.listTypes().forEach(function (type) {
    schema.schema[type.name] = {
        type: type.name,
        fieldClass: 'row'
    }
});
