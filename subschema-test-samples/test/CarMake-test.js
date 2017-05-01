import React from 'react';
import {into, expect, byTypes, select}  from 'subschema-test-support';
import {newSubschemaContext} from 'subschema';
import {CarMake} from 'subschema-test-samples';

describe('subschema-test-samples/CarMake', function () {
    it('should not be selectable', function () {
        const Subschema = newSubschemaContext();
        const {Form, loader, valueManager, importer} = Subschema;
        const Select = loader.loadType('Select');
        var schema = CarMake.schema;
        //loader, schema, Subschema, React

        expect(CarMake).toExist('CarMake-setup should load');
        CarMake.setupFunc(importer, schema);

        var form = into(<Form schema={schema} />);

        var selects = byTypes(form, Select);
        expect(selects.length).toBe(2, 'should have 2 selects');
        select(selects[0], 1);
        expect(valueManager.path('make')).toBe('amc');
        var selects = byTypes(form, Select);
        expect(selects[1].props.placeholder).toBe('Select a model of AMC');
        select(selects[1], 2);
        expect(valueManager.path('model')).toBe('Concord');

    })
});