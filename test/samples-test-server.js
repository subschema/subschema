"use strict";
/**
 * Sanity test to ensure everything will work/render server side.
 *
 * One day sample tests will be moved to subschema-test-support and somehow testable
 * server/client.  Until then....
 */
require('source-map-support').install();
var React = require('react');
var ReactServer = require('react-dom/server');
var expect = require('expect');
var samples = require('subschema-test-support/samples');

describe('samples', function () {
    ['First', 'Second'].forEach(function (key) {
        describe(key + ' Run', function () {
            var subschema = require('../dist/subschema-server.js');
            var newSubschemaContext = subschema.newSubschemaContext;

            Object.keys(samples).forEach(function (key) {
                var sample = samples[key];
                it(`render sample ${key} with data`, function () {
                    var Subschema = newSubschemaContext();
                    var ValueManager = Subschema.ValueManager;
                    var Form = Subschema.Form;
                    var loader = Subschema.loader;
                    var valueManager = ValueManager(sample.data);
                    if (sample.setupFunc) {
                        sample.setupFunc(loader, sample.schema, Subschema, React, valueManager);
                    }
                    var form = ReactServer.renderToString(React.createElement(Form, {
                        schema: sample.schema,
                        loader: loader,
                        valueManager: valueManager
                    }));
                    expect(form).toExist(`form should exist for ${key}`);
                    expect(form).toMatch(/^</);
                    expect(form).toMatch(/>$/);

                });
            });
        })
    });
});

