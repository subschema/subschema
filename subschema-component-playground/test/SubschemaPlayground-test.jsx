import React from 'react';
import SubschemaPlayground from 'subschema-component-playground/lib/SubschemaPlayground';
import {into, expect} from 'subschema-test-support';
import samples from 'subschema-test-samples';
describe.only('subschema-component-playground/SubschemaPlayground', function () {
    //Object.keys(samples)
     ['Wizard']   .forEach(function (key) {
        it(`should load into playground subschema-test-samples/${key}`, function () {
            const sample = samples[key];
            const sp = into(<SubschemaPlayground {...sample} transition={false}/>, true);
            expect(sp).toExist(`Subschema Playground should exist ${key}`);
        });
    });
});