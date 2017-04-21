import React from 'react';
import {into, expect, byTypes}  from 'subschema-test-support';
import {Loader} from 'subschema-test-samples'
import {newSubschemaContext}  from 'subschema';


describe('public/Loader', function () {

    this.timeout(50000);
    it('should load a custom type', () => {
        const Subschema = newSubschemaContext();
        const {Form, importer, loader} = Subschema;
        const schema = Loader.schema;
        const s = schema;

        Loader.setupFunc(importer, schema);
        var form = into(<Form schema={s} loader={loader}/>, true);

        var CheckboxSelect = loader.loadType('CheckboxSelect');
        expect(CheckboxSelect).toExist('CheckboxSelect should be found');

        var cselects = byTypes(form);


    });
});