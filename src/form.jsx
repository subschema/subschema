//Being tricky, in web mode we will load it, in non web mode we will load the .js.
// This will load the default templates. I am expecting several bug reports about this.
var loader = require('./loader.js');
loader.addLoader(require('./ValidatorLoader'));
loader.addLoader(require('./loader.jsx'));
module.exports = require('./form');