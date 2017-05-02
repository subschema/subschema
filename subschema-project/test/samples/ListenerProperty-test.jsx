import React from 'react';
import {into, expect, byType}  from 'subschema-test-support';
import {newSubschemaContext} from 'subschema';
import {ListenerProperty} from 'subschema-test-samples';
import {setupFunc} from '../support';

describe('subschema-test-samples/ListenerProperty', function () {
    this.timeout(50000);
    it('should render favorites', function () {
        const Subschema = newSubschemaContext();
        const {Form, importer, valueManager} = Subschema;

        var mod = {exports: {}};
        const context = setupFunc(ListenerProperty, Subschema);

        var SelectListener = Subschema.loader.loadType('SelectListen');
        expect(mod.exports).toExist('SelectListen');

        var form = into(<Form {...context}/>, true);

        var select = byType(form, SelectListener);

        expect(select).toExist('rendered SelectListen');

        valueManager.update('favorites', ListenerProperty.data.favorites);

        var select = byType(form, SelectListener);
        expect(select).toExist();
        expect(select.props.options.length).toBe(2);

    })
});