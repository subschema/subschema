import React from 'react';
import SubschemaPlayground from 'subschema-component-playground/lib/SubschemaPlayground';
import { expect, into } from 'subschema-test-support';
import newSubschemaContext from 'subschema-test-support/lib/newSubschemaContext';

import samples from 'subschema-test-samples';
describe('subschema-component-playground-test', function () {
    Object.keys(samples).forEach(function (key) {
        it(`should load into playground subschema-component-playground/${key}`,
            function () {
                const sample                      = samples[key];
                const {
                          Form,
                          context: { injector }

                      }                           = newSubschemaContext();
                const InjectedSubschemaPlayground = injector.inject(
                    SubschemaPlayground);
                const sp                          = into(
                    <Form template={'ObjectTemplate'}
                          schema={{}}><InjectedSubschemaPlayground {...sample} /></Form>,
                    true);
                expect(sp).toExist(`Subschema Playground should exist ${key}`);
            });
    });
});
