import React from 'react';
import SubschemaPlayground from 'subschema-component-playground/lib/SubschemaPlayground';
import { expect, into } from 'subschema-test-support';
import samples from 'subschema-test-samples';
describe('subschema-component-playground-test', function () {
    Object.keys(samples).forEach(function (key) {
        it(`should load into playground subschema-test-samples/${key}`,
            function () {
                const sample = samples[key];
                const sp     = into(<SubschemaPlayground {...sample} />, true);
                expect(sp).toExist(`Subschema Playground should exist ${key}`);
            });
    });
});
