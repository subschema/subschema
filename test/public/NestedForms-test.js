import {React, into,TestUtils,expect,byTypes, byComponents, select, byId, Simulate}  from 'subschema-test-support';
import Subschema, {Form, types, ValueManager, templates} from 'Subschema';
var NestedForms = require('subschema-test-support/samples/NestedForms.js');

describe('NestedForms', function () {
    it('should render simple nested with seperate templates', function () {
        var form = into(<Form
            schema={{schema:{first:'Text',
              second:{type:'Object',
              subSchema:{
                test:'Text'
              }}},
             fieldsets:[{legend:'First Legend', fields:'first'},

            {legend:'Second Legend', fields:'second.test'}]}}
        />, true);
        expect(form).toExist();
        expect(byComponents(form, templates.FieldSetTemplate).length).toBe(3)
    });
    it('should render simple nested', function () {
        var form = into(<Form
            schema={{schema:{first:'Text',
              second:{type:'Object',
              subSchema:{
                test:'Text'
              }}},
              fieldsets:[{fields:'second.test, first', legend:'All'}]
             }}
        />, true);
        expect(form).toExist();
        expect(byComponents(form, templates.FieldSetTemplate).length).toBe(2)
    });
    it('should render nested forms', ()=> {
        var valueManager = ValueManager(NestedForms.data);

        console.log('schema', NestedForms.schema);
        var form = into(<Form schema={NestedForms.schema} valueManager={valueManager}/>, true);

        var street = byId(form, 'address.street');

        expect(street).toExist('should render street');

        expect(street.value).toBe('1 First St');

        valueManager.update('address.street', 'Something');
        var street = byId(form, 'address.street');
        expect(street.value).toBe('Something');

    });
});