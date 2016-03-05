import {React, into,TestUtils,expect,byTypes, select,  Simulate}  from 'subschema-test-support';
import {newSubschemaContext, types} from 'Subschema';
import CarMakeSetup from 'subschema-test-support-samples/CarMake-setup.js';
import CarMake from 'subschema-test-support-samples/CarMake.js';
const Select = types.Select;

describe('public/CarMake', function () {
    it('should not be selectable', function () {
        const SubSchema = newSubschemaContext();
        const {Form, loader, ValueManager} = SubSchema;

        var schema = CarMake.schema;
        //loader, schema, Subschema, React

        expect(CarMake).toExist('CarMake-setup should load');
        var valueManager = ValueManager();
        CarMakeSetup(loader, schema, Subschema, React, valueManager);

        var form = into(<Form schema={schema} valueManager={valueManager}/>);

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