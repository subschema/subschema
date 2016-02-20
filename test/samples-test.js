"use strict";
import React from 'react';
import expect from 'expect';
import samples from 'subschema-test-support/samples';
import {into} from 'subschema-test-support';
import Subschema, {ValueManager, Form, loaderFactory, DefaultLoader, decorators, injector} from 'subschema';

describe('samples', function () {
    let oloader = decorators.provide.defaultLoader;
    let loader = null;
    let listen = null;
    before(function () {
        loader = loaderFactory([DefaultLoader]);
        decorators.provide.defaultLoader = loader;
    });
    after(function () {
        decorators.provide.defaultLoader = oloader;
        listen && listen();
    });

    Object.keys(samples).forEach(function (key) {
        const sample = samples[key];
        it(`render sample ${key} with data`, function () {
            console.log('Testing', key, sample.schema, sample.data);
            const valueManager = ValueManager(sample.data);
            listen = valueManager.addListener(null, (...args)=>{
               console.log('change', ...args)
            }).remove;
            if (sample.setupFile) {
                const setupFile = require(`subschema-test-support/samples/${sample.setupFile}`);
                setupFile(loader, sample.schema, Subschema, React, valueManager);
            }
            const form = into(<Form schema={sample.schema} loader={loader} injector={injector}
                                    valueManager={valueManager}/>, true);
            expect(form).toExist(`form should exist for ${key}`);
        });
    });
});