"use strict";

import React from 'react';
import {into,TestUtils,expect, byId, byTypes, Simulate}  from 'subschema-test-support';
import loaderTestSetup from 'subschema-test-support-samples/Loader-setup.js';
import LoaderTest from 'subschema-test-support-samples/Loader.js'
import {newSubschemaContext}  from 'Subschema';


describe('public/Loader', function() {

    this.timeout(50000);
    it('should load a custom type', ()=> {
        const Subschema = newSubschemaContext();
        const {Form,  ValueManager, loader} = Subschema;
        const schema = LoaderTest.schema;
        const valueManager = ValueManager();
        const s = schema;

        loaderTestSetup(loader, schema, Subschema, React, valueManager);
        var form = into(<Form schema={s} loader={loader}/>, true);

        var CheckboxSelect = loader.loadType('CheckboxSelect');
        expect(CheckboxSelect).toExist('CheckboxSelect should be found');

        var cselects = byTypes(form);


    });
});