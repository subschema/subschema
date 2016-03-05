"use strict";
import React from 'react';
import { into,TestUtils,expect,byTypes, byId, select,  Simulate}  from 'subschema-test-support';
import  {newSubschemaContext, Form, types, ValueManager} from 'Subschema';
import CustomTypeSetup from 'subschema-test-support-samples/CustomType-setup.js';
import CustomType from 'subschema-test-support-samples/CustomType.js';

describe('public/CustomType', function () {
    it('should render', function () {
        const schema = CustomType.schema;
        //loader, schema, Subschema, React
        const Subschema = newSubschemaContext();
        const {Form, loader, ValueManager} = Subschema;
        const valueManager = ValueManager();

        expect(CustomTypeSetup).toExist('CustomTypeSetup-setup should load');
        CustomTypeSetup(loader, schema, Subschema, React, valueManager);

        var form = into(<Form schema={schema} valueManager={valueManager}/>);


    })
});