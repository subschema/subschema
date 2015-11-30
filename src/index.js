var context = require.context('.', false, /^(?!.*(index|Dom|DefaultLoader).js(x)?$).*\.js(x)?$/), api = {}; //make sure you have your directory and regex test set correctly!
//keep contract for now, Template needs before decorator.
api.Conditional = require('./components/Conditional.jsx');
api.Editor = require('./components/Editor.jsx');
api.NewChildContext = require('./components/NewChildContext.jsx');
api.Template = require('./components/Template.jsx');
api.Form = require('./components/Form.jsx');

api.decorators = require('./decorators');

context.keys().forEach(function (key) {

    var k = key.replace(/^\.\/(.*)\.js(x)?$/, '$1');
    api[k] = context(key);
});


module.exports = api;