"use strict";
import React from 'react';
import expect from 'expect';
import samples from 'subschema-test-support/samples';
import {into} from 'subschema-test-support';
import Subschema, {newSubschemaContext} from 'subschema';

describe.only('samples', function () {

//    Object.keys(samples)
        ['Checkboxes']

        .forEach(function (key) {
        const sample = samples[key];
        it(`render sample ${key} with data`, function () {
            const Subschema = newSubschemaContext();
            const {ValueManager, Form, loader,  injector} = Subschema;
            const valueManager = ValueManager(sample.data);
            if (sample.setupFile) {
                const setupFile = require(`subschema-test-support/samples/${sample.setupFile}`);
                setupFile(loader, sample.schema, Subschema, React, valueManager);
            }
            const form = into(<Form schema={sample.schema} loader={loader} injector={injector}
                                    valueManager={valueManager}/>, true);
            expect(form).toExist(`form should exist for ${key}`);
        });

        it(`render sample ${key} without data`, function () {
            const Subschema = newSubschemaContext();
            const {ValueManager, Form, loader,  injector} = Subschema;
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
            const Subschema = newSubschemaContext();
            const {ValueManager, Form, loader,  injector} = Subschema;
            const valueManager = ValueManager();
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