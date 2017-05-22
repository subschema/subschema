var path = require('path');
var fs = require('fs');
var babelProcess = require('./babel-process');
var babelrc = path.resolve(process.cwd(), '.babelrc');
var conf;
if (fs.existsSync(babelrc)) {
    conf = JSON.parse(fs.readFileSync(babelrc, 'utf8'));
}
//defaults to ./babelrc.json
module.exports = babelProcess(conf, void(0), !!process.env.SUBSCHEMA_COVERAGE_LOAD_PLUGIN);