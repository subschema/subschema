#!/usr/bin/env node
var path = require('path');
process.env.SUBSCHEMA_PROJECT_DIR = process.cwd();
process.chdir(path.resolve(__dirname, '..'));
if (process.env.SUBSCHEMA_DEBUG = 1) {
    console.warn('Current Dir', process.cwd());
    console.warn('Project Dir', process.env.SUBSCHEMA_PROJECT_DIR);
}
require('../node_modules/.bin/haul');