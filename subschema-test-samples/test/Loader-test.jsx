"use strict";

import React from 'react';
import {into,TestUtils,expect, byId, byTypes, Simulate}  from 'subschema-test-support';
import {Loader} from 'subschema-test-samples'
import {newSubschemaContext}  from 'Subschema';


describe('public/Loader', function() {

    this.timeout(50000);
    it('should load a custom type', ()=> {
        const Subschema = newSubschemaContext();
        const {Form,  ValueManager, loader} = Subschema;
        const schema = Loader.schema;
        const valueManager = ValueManager();
        const s = schema;

        Loader.setupFunc(loader, schema, Subschema, React, valueManager);
        var form = into(<Form schema={s} loader={loader}/>, true);

        var CheckboxSelect = loader.loadType('CheckboxSelect');
        expect(CheckboxSelect).toExist('CheckboxSelect should be found');

        var cselects = byTypes(form);


    });
});