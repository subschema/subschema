"use strict";
import React from 'react';
import expect from 'expect';
import samples from 'subschema-test-support/samples';
import {into} from 'subschema-test-support';
import Subschema, {ValueManager, Form, loaderFactory, DefaultLoader, decorators, injector} from 'subschema';

describe('samples', function () {
    let oloader = decorators.provide.defaultLoader;
    let loader = null;
    before(function () {
        loader = loaderFactory([DefaultLoader]);
        decorators.provide.defaultLoader = loader;
    });
    after(function () {
        decorators.provide.defaultLoader = oloader;
    });

    Object.keys(samples).forEach(function (key) {
        const sample = samples[key];
        it(`render sample ${key} with data`, function () {
            const valueManager = ValueManager(sample.data);
            if (sample.setupFile) {
                const setupFile = require(`subschema-test-support/samples/${sample.setupFile}`);
                setupFile(loader, sample.schema, Subschema, React, valueManager);
            }
            const form = into(<Form schema={sample.schema} loader={loader} injector={injector}
                                    valueManager={valueManager}/>);
            expect(form).toExist(`form should exist for ${key}`);
        });

        it(`render sample ${key} without data`, function () {
            const valueManager = ValueManager();
            if (sample.setupFile) {
                const setupFile = require(`subschema-test-support/samples/${sample.setupFile}`);
                setupFile(loader, sample.schema, Subschema, React, valueManager);
            }
            const form = into(<Form schema={sample.schema} loader={loader} injector={injector}
                                    valueManager={valueManager}/>);
            expect(form).toExist(`form should exist for ${key}`);
        });

        it(`render sample ${key} with data and errors`, function () {
            const valueManager = ValueManager(sample.data, sample.errors);
            if (sample.setupFile) {
                const setupFile = require(`subschema-test-support/samples/${sample.setupFile}`);
                setupFile(loader, sample.schema, Subschema, React, valueManager);
            }
            const form = into(<Form schema={sample.schema} loader={loader} injector={injector}
                                    valueManager={valueManager}/>);
            expect(form).toExist(`form should exist for ${key}`);
        });
    });
});