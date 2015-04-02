#!/usr/bin/env node

var fs = require('fs');
var args = process.argv.splice(2);

if (args.length === 0){
    console.log('makeTest <file>');
}
args.map(function(f){
    return fs.statSync(f);
}).filter(function(f){
    return f..isFile()
});