#!/usr/bin/env node
console.log(require('../src/DefaultLoader')(require('subschema-dev-support/webpack-utils').filteredDependencies(require(`${process.cwd()}/package.json`))).code);