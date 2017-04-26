import React from 'react';
import SubschemaPlayground from 'subschema-component-demo/lib/components/SubschemaPlayground';
import {into} from 'subschema-test-support';
import expect from 'expect';
import samples from 'subschema-test-samples';

describe('components/SubschemaPlayground', function () {
    it('should render', function () {
        const {Loader} = samples;
        var sp = into(<SubschemaPlayground schema={Loader.schema} setupTxt={Loader.setupTxt}
                                           props={Loader.props}
                                           imports={Loader.imports}/>, true);
        expect(sp).toExist();
    });
});