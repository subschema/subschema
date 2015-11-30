module.exports = function (content) {
    return  'module.exports = function sampleloader(loader, schema, Subschema, React, valueManager){\n//---injected content here--\n'+content+'\n}'
}