"use strict";
//This should really only happen to top level projects.
// which subschema can be.   So its needed, but in generally
// if compiling subschema with webpack, you will just point
//and happens automagically with node.
/*

I thought about having a prebuilt subschema intended just
to speed up builds, something that you could just include,
the pieces you need, but that has issues, also. 

If I keep this in the index, than its bad, if I keep it here
than its bad.   I have no non-bad solution.  This seems least bad.

 */

require('babel-polyfill');
module.exports = require('./index');
