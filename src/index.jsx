var api = require('./index.js');
api.loader.addLoader(require('./ValidatorLoader'));
api.loader.addLoader(require('./DefaultLoader'));
api.templates = require('./templates/index.js');
api.types = require('./types/index.js');
api.styles = require('./styles/index.js');
api.Dom = require('./Dom');
module.exports = api;
