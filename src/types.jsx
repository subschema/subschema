var types = {};

require.context('./types/', true, /\.js(x)?$/).keys().forEach((v)=> {
    var name = v.replace(/\.\/(.*)\.js(x)?/, '$1');
    types[name] = require('./types/' + v.replace('./', ''));
});
module.exports = types;