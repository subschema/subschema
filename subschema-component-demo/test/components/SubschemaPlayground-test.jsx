import React from 'react';
import SubschemaPlayground from 'subschema-component-demo/lib/components/SubschemaPlayground.jsx';
import {into} from 'subschema-test-support';
import expect from 'expect';
import samples from 'subschema-test-support';

const {Loader} = samples;
describe.only('components/SubschemaPlayground', function () {
    it('should render', function () {
        var sp = into(<SubschemaPlayground schema={Loader.schema} setupTxt={Loader.setupTxt}
                                           formProps={['schema', 'value', 'loader']}
                                           imports={['loader', 'valueManager']}/>, true);
        expect(sp).toExist();
    });
});