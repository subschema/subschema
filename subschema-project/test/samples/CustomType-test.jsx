import React from 'react';
import {into, expect, byComponent}  from 'subschema-test-support';
import {newSubschemaContext} from 'subschema';
import {CustomType} from 'subschema-test-samples';
import {setupFunc} from '../support';

describe('subschema-test-samples/CustomType', function () {
    it('should render', function () {
        const schema = CustomType.schema;
        //loader, schema, Subschema, React
        const Subschema = newSubschemaContext();
        const {Form, importer} = Subschema;

        const context = setupFunc(CustomType, Subschema);

        const form = into(<Form  {...context}/>, true);

        const SwitchButton = Subschema.loader.loadType('SwitchButton');
        expect(SwitchButton).toExist();
        expect(byComponent(form, SwitchButton)).toExist();
    })
});