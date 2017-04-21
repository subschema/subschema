import React from 'react';
import {into, expect, byComponent}  from 'subschema-test-support';
import {newSubschemaContext} from 'subschema';
import {CustomType} from 'subschema-test-samples';

describe('public/CustomType', function () {
    it('should render', function () {
        const schema = CustomType.schema;
        //loader, schema, Subschema, React
        const Subschema = newSubschemaContext();
        const {Form, importer} = Subschema;

        expect(CustomType.setupFunc).toExist('CustomTypeSetup-setup should load');
        CustomType.setupFunc(importer, schema);

        const form = into(<Form schema={schema} loader={Subschema.loader}
                                valueManager={Subschema.valueManager}/>, true);

        const SwitchButton = Subschema.loader.loadType('SwitchButton');
        expect(SwitchButton).toExist();
        expect(byComponent(form, SwitchButton)).toExist();
    })
});