import React from 'react';
import {into, expect, byTypes, select}  from 'subschema-test-support';
import {newSubschemaContext} from 'subschema';
import {CarMake} from 'subschema-test-samples';
import {setupFunc} from '../support';

describe('subschema-test-samples/CarMake', function () {
    it('should not be selectable', function () {
        const Subschema = newSubschemaContext();
        const {Form, loader} = Subschema;
        const Select = loader.loadType('Select');
        var schema = CarMake.schema;
        //loader, schema, Subschema, React

        expect(CarMake).toExist('CarMake-setup should load');
        const context = setupFunc(CarMake, Subschema);

        var form = into(<Form {...context} />, true);

        var selects = byTypes(form, Select);
        expect(selects.length).toBe(2, 'should have 2 selects');
        select(selects[0], 1);
        expect(context.valueManager.path('make')).toBe('amc');
        var selects = byTypes(form, Select);
        expect(selects[1].props.placeholder).toBe('Select a model of AMC');
        select(selects[1], 2);
        expect(context.valueManager.path('model')).toBe('Concord');

    })
});