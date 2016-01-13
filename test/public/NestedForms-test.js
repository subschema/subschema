import {React, into,TestUtils,expect,byTypes, select, byId, Simulate}  from 'subschema-test-support';
import Subschema, {Form, types, ValueManager} from 'Subschema';
var NestedForms = require('subschema-test-support/samples/NestedForms.js');

describe('NestedForms', function () {

    it('should render nested forms', ()=> {
        var valueManager = ValueManager(NestedForms.data);

        var form = into(<Form schema={NestedForms.schema} valueManager={valueManager}/>);

        var street = byId(form, 'address.street');

        expect(street).toExist('should render street');

        expect(street.value).toBe('1 First St');

        valueManager.update('address.street', 'Something');

        expect(street.value).toBe('Something');

    });
});