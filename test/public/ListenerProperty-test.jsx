"use strict";
import React from 'react';
import { into,TestUtils,expect,byTypes, byType, byId, select,  Simulate}  from 'subschema-test-support';
import {newSubschemaContext} from 'Subschema';
import ListenerPropertySetup from 'subschema-test-support-samples/ListenerProperty-setup.js';
import ListenerProperty from 'subschema-test-support-samples/ListenerProperty.js';

describe('public/ListenerProperty', function () {
    this.timeout(50000);
    it('should render favorites', function () {
        const Subschema = newSubschemaContext();
        const {Form, ValueManager, loader} =Subschema;
        var schema = ListenerProperty.schema;

        var valueManager = ValueManager(), mod = {exports: {}};

        ListenerPropertySetup(loader, schema, Subschema, React, valueManager, mod);

        var SelectListener = loader.loadType('SelectListen');
        expect(mod.exports).toExist('SelectListen');

        var form = into(<Form schema={schema} valueManager={valueManager} loader={loader}/>, true);

        var select = byType(form, SelectListener);

        expect(select).toExist('rendered SelectListen');

        valueManager.update('favorites', ListenerProperty.data.favorites);

        var select = byType(form, SelectListener);
        expect(select).toExist();
        expect(select.props.options.length).toBe(2);

    })
});