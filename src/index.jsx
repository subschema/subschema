var index = require('./index');
index.loader.addLoader(require('./DefaultLoader.jsx'));
index.form = require('./form.jsx');
module.exports = index;
