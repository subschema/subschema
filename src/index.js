var context = require.context('.', false, /^(?!.*(index|Dom|DefaultLoader).js(x)?$).*\.js(x)?$/), api = {}; //make sure you have your directory and regex test set correctly!
context.keys().forEach(function (key) {
    var k = key.replace(/^\.\/(.*)\.js(x)?$/, '$1');
    api[k] = context(key);
});
api.decorators = require('./decorators');
module.exports = api;