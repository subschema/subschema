module.exports = function (content) {
    content =  '//hello\nmodule.exports = function sampleloader(loader, schema, Subschema, React, valueManager){\n//---injected content here--\n'+content+'\n}'

    console.log("got content\n\n\n", content, "\n\n\n");

    return content;
}