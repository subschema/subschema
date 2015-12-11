import {React, into,TestUtils,expect,byTypes, byType, byId, select,  Simulate}  from '../support';
import Subschema, {Form, types, decorators,loaderFactory, DefaultLoader,ValueManager} from 'Subschema';
var {provide} = decorators;
var {Select} = types;
var ListenerPropertySetup = require('../../public/samples/ListenerProperty-setup.js');
var ListenerProperty = require('../../public/samples/ListenerProperty.js');

describe('ListenerProperty', function () {
    this.timeout(50000);
    it('should render', function () {
        var schema = ListenerProperty.schema;
        var loader = provide.defaultLoader = loaderFactory([DefaultLoader]);
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