"use strict";

import {React, into,TestUtils,expect,byTypes, byId, select,  Simulate}  from 'subschema-test-support';
import Subschema, {Form, types, ValueManager} from 'Subschema';
import CustomTypeSetup from 'subschema-test-support/samples/CarMake-setup.js';
import CustomType from 'subschema-test-support/samples/CarMake.js';
const  {Select} = types;

describe('public/CustomType', function () {
    it('should render', function () {
        var schema = CustomType.schema;
        //loader, schema, Subschema, React
        var loader = Subschema.loaderFactory([Subschema.DefaultLoader]);
        expect(CustomTypeSetup).toExist('CarMake-setup should load');
        var valueManager = ValueManager();
        CustomTypeSetup(loader, schema, Subschema, React, valueManager);

        var form = into(<Form schema={schema} valueManager={valueManager}/>);


    })
});