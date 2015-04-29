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
var fs = require('fs'),
    path = require('path'),
    pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'))),
    nodeModules = path.join(process.cwd(), '../../node_modules/'),
    reactPath = path.join(nodeModules, 'react');
reactNativePath = path.join(nodeModules, 'react-native');

console.log('postinstall', __dirname, reactNativePath);
if (require.main === module) {
    console.log('running as a script')
    nativeReactInstall();
    process.exit(0);
} else {
    module.exports = nativeReactInstall;
}
function nativeReactInstall() {
    if (!fs.existsSync(reactNativePath)) {
        return
    }
    console.log('living in a react native world', reactVersion);
    var reactVersion = require(path.join(reactNativePath, 'package.json')).version;


    writeJSON('../package.json.' + Date.now(), pkg);


    pkg.devDependencies = {};
    delete pkg.peerDependencies.react;
    pkg.peerDependencies["react-native"] = reactVersion;

    pkg.main = "src/index"

    writeJSON('../package.json', pkg);
    write('../src/react.js', 'module.exports = require("react-native");\n');
    if (fs.existsSync(reactPath)) {
        console.log('removing non native react', reactPath);
        deleteFolderRecursive(reactPath);
    }
}
function deleteFolderRecursive(ep) {
    console.log('delete ',reactPath, 'or it will cause problems, I am not brave enough to');
};
function write(file, content) {
    fs.writeFileSync(path.join(__dirname, file), content);
}
function writeJSON(file, content) {
    write(file, JSON.stringify(content, null, 2));
}
