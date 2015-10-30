var index = require('./index.js');
index.DefaultLoader = require('./DefaultLoader.jsx');
index.loader.addLoader(index.DefaultLoader);
index.Form = require('./form.jsx');
module.exports = index;
