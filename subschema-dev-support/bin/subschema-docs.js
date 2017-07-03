#!/usr/bin/env node

var parser = require('react-docgen');

var fs       = require('fs');
var path     = require('path');
var resolver = require(
    'react-docgen/dist/resolver/findAllComponentDefinitions').default;
function isDir(p) {
    try {
        return fs.statSync(p).isDirectory();
    } catch (e) {
        return false;
    }
}
function parse(filename) {
    console.log('parsing', filename);
    try {
        var src = fs.readFileSync(filename);
        return parser.parse(src, resolver);
    } catch (e) {
        console.warn(`Error parsing "%s"`, filename)
        console.trace(e);
        return null;
    }
}

function traverseDir(filePath, result = {}) {

    return fs.readdirSync(filePath).reduce(function (ret, f) {
        const fp = path.join(filePath, f);
        if (isDir(fp)) {
            traverseDir(fp, ret);
        } else if (/\.jsx?$/.test(f)) {
            ret[fp.replace(/\.jsx?$/, '')] = parse(fp);
        }
        return ret;
    }, result);
}

function stringOfLength(string, length) {
    var newString = '';
    for (var i = 0; i < length; i++) {
        newString += string;
    }
    return newString;
}

function generateTitle(name) {
    var title = '`' + name + '` (component)';
    return title + '\n' + stringOfLength('=', title.length) + '\n';
}

function generateDesciption(description) {
    return description + '\n';
}

function generatePropType(type) {
    var values;
    if (Array.isArray(type.value)) {
        values = '(' +
                 type.value.map(function (typeValue) {
                     return typeValue.name || typeValue.value;
                 }).join('|') +
                 ')';
    } else {
        values = type.value;
    }

    return 'type: `' + type.name + (values ? values : '') + '`\n';
}

function generatePropDefaultValue(value) {
    return 'defaultValue: `' + value.value + '`\n';
}

function generateProp(propName, prop) {
    return (
        '### `' + propName + '`' + (prop.required ? ' (required)' : '') + '\n' +
        '\n' +
        (prop.description ? prop.description + '\n\n' : '') +
        (prop.type ? generatePropType(prop.type) : '') +
        (prop.defaultValue ? generatePropDefaultValue(prop.defaultValue) : '') +
        '\n'
    );
}

function generateProps(props) {
    var title = 'Props';

    return (
    title + '\n' +
    stringOfLength('-', title.length) + '\n' +
    '\n' + (props ? Object.keys(props).sort().map(function (propName) {
        return generateProp(propName, props[propName]);
    }).join('\n') : ''));
}

function generateMarkdown(name, reactAPI) {
    var markdownString =
            generateTitle(name) + '\n' +
            generateDesciption(reactAPI.description) + '\n' +
            generateProps(reactAPI.props);

    return markdownString;
}

process.chdir('src');
var res = traverseDir('.');

if (!isDir('../docs')) {
    fs.mkdirSync('../docs');
}
fs.writeFileSync('../docs/doc.json', JSON.stringify(res || {}, null, 2),
    { encoding: 'utf-8', 'flag': 'w' });
fs.writeFileSync('../docs/index.md',
    Object.keys(res).reduce(function (str, file) {
        if (!(res[file])) {
            return str;
        }
        return str + generateMarkdown(file, res[file][0]);

    }, { encoding: 'utf-8', 'flag': 'w' }));
