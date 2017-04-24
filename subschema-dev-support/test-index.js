require('babel-polyfill');
var testsContext = require.context("test", true, /-test\.jsx?$/);
testsContext.keys().forEach(testsContext);