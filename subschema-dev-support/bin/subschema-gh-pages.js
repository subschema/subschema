#!/usr/bin/env node
var child = require('child_process');
var fs = require('fs');
var path = require('path');
var cwd = path.resolve.bind(path, process.cwd());
var pkg = require(cwd('package.json'));
var hasGit = fs.existsSync(cwd('.git')) && fs.lstatSync(cwd('.git')).isDirectory();
var inquirer = require('inquirer');
if (!hasGit) {
    child.execSync('git', ['init']);
}




