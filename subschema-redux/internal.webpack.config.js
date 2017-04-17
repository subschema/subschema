const config = require('../subschema/internal.webpack.config');
const path = require('path');
module.exports = function(){
    var ret = config.apply(this, arguments);
    ret.resolve.alias['ValueManager'] = path.join(__dirname, 'src','ReduxValueManager.js');
    return ret;

};