#!/usr/bin/env node
/**
 * React native has its own packaging system, and it has some peculiarities.
 * So I wrote this thing so that everything would resolve in a  react native world.
 *
 * Now I hope there is a better way in the future, perhaps just have a node module
 * that does the right thing, but until then, we've got this.
 *
 *
 */
var fs = require('fs'), path = require('path'),

    pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'))),

    reactPath = path.join(path.join(process.cwd(), '../../node_modules/react-native'));

console.log('postinstall', __dirname, reactPath);
if (fs.existsSync(reactPath)) {

    console.log('living in a react native world', reactVersion);
    var reactVersion = require(path.join(reactPath, 'package.json')).version;


    writeJSON('../package.json.' + Date.now(), pkg);


    pkg.devDependencies = {};

    pkg.peerDependencies = {
        "react-native": reactVersion
    }
    pkg.main="src/index"

    writeJSON('../package.json', pkg);
    write('../src/react.js', 'module.exports = require("react-native");\n');
}

function write(file, content) {
    console.log('writing', file);
    fs.writeFileSync(path.join(__dirname, file), content);
}
function writeJSON(file, content) {
    write(file, JSON.stringify(content, null, 2));
}
