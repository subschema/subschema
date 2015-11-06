var api = require('./index.js');
api.loader.addLoader(require('./ValidatorLoader'));
api.loader.addLoader(require('./DefaultLoader'));
module.exports = api;
