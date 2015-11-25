var api = require('./index.js');
api.DefaultLoader = require('./DefaultLoader');
api.decorators.provide.defaultLoader = api.loader;
api.loader.addLoader(api.DefaultLoader);
api.templates = require('./templates/index.js');
api.types = require('./types/index.js');
api.styles = require('./styles/index.js');
api.Dom = require('./Dom');
module.exports = api;
