import React from 'react';
import {into, expect, byTypes}  from 'subschema-test-support';
import {Loader} from 'subschema-test-samples'
import {newSubschemaContext}  from 'subschema';
import {setupFunc} from '../support';


describe('subschema-project/samples/Loader', function () {

    this.timeout(50000);
    it('should load a custom type', () => {
        const Subschema = newSubschemaContext();
        const {Form,  loader} = Subschema;

        const context = setupFunc(Loader, Subschema);
        var form = into(<Form {...context}/>, true);

        var CheckboxSelect = loader.loadType('CheckboxSelect');
        expect(CheckboxSelect).toExist('CheckboxSelect should be found');

        var cselects = byTypes(form);


    });
});