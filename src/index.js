var context = require.context('.', false, /^(?!.*(index).js(x)?$).*\.js(x)?$/), api = {}; //make sure you have your directory and regex test set correctly!
context.keys().forEach(function (key) {
    var k = key.replace(/^\.\/(.*)\.js(x)?$/, '$1');
    if (/index/.test(k)) return;
    api[k] = context(key);
});
api.templates = require('./templates/index.js');
api.types = require('./types/index.js');
api.styles = require('./styles/index.js');
module.exports = api;