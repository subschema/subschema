var index = require('./index.js');
index.DefaultLoader = require('./DefaultLoader.js');
index.loader.addLoader(index.DefaultLoader);
index.Form = require('./form.jsx');
module.exports = index;
