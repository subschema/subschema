import React from 'react';
import {into, expect, byType}  from 'subschema-test-support';
import {newSubschemaContext} from 'subschema';
import {ListenerProperty} from 'subschema-test-samples';

describe('subschema-test-samples/ListenerProperty', function () {
    this.timeout(50000);
    it('should render favorites', function () {
        const Subschema = newSubschemaContext();
        const {Form, importer, valueManager} = Subschema;

        var mod = {exports: {}};

        ListenerProperty.setupFunc(importer, ListenerProperty.schema);

        var SelectListener = Subschema.loader.loadType('SelectListen');
        expect(mod.exports).toExist('SelectListen');

        var form = into(<Form schema={ListenerProperty.schema} valueManager={Subschema.valueManager}
                              loader={Subschema.loader}/>, true);

        var select = byType(form, SelectListener);

        expect(select).toExist('rendered SelectListen');

        valueManager.update('favorites', ListenerProperty.data.favorites);

        var select = byType(form, SelectListener);
        expect(select).toExist();
        expect(select.props.options.length).toBe(2);

    })
});