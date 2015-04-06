var types = {};

require.context('./', true, /\.js(x)?$/).keys().forEach((v)=> {

    var name = v.replace(/\.\/(.*)\.js(x)?/, '$1');
    types[name] = require(v);

});
module.exports = types;