require('source-map-support').install();

var subschema = require('../dist/subschema-server.js');
process.exit(subschema ? 0 : 1);
