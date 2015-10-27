var index = require('./index');
index.DefaultLoader = require('./DefaultLoader.jsx');
index.loader.addLoader(index.DefaultLoader);
index.form = require('./form.jsx');
module.exports = index;
