"use strict";
import React from 'react';
import {into, TestUtils, expect, byTypes, byId, select, Simulate}  from 'subschema-test-support';
import  {newSubschemaContext, Form, types, ValueManager} from 'Subschema';
import {CustomType} from 'subschema-test-samples';

describe('public/CustomType', function () {
    it('should render', function () {
        const schema = CustomType.schema;
        //loader, schema, Subschema, React
        const Subschema = newSubschemaContext();
        const {Form, loader, ValueManager} = Subschema;
        const valueManager = ValueManager();

        expect(CustomType.setupFunc).toExist('CustomTypeSetup-setup should load');
        CustomType.setupFunc(loader, schema, Subschema, React, valueManager);

        var form = into(<Form schema={schema} valueManager={valueManager}/>);


    })
});