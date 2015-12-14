import {React, into,TestUtils,expect, byId, byTypes, Simulate}  from '../support';

import Subschema from 'Subschema';


var loaderTestSetup = require('../../public/samples/Loader-setup.js');
var LoaderTest = require('../../public/samples/Loader.js');


describe('Loader Example', ()=> {


    it('should load a custom type', ()=> {

        var {Form,  ValueManager, loaderFactory, DefaultLoader, decorators} = Subschema;
        var loader = decorators.provide.defaultLoader = loaderFactory([DefaultLoader]);
        var schema = LoaderTest.schema;
        var valueManager = ValueManager();
        loaderTestSetup(loader, schema, Subschema, React, valueManager);
        var s = schema;
        var form = into(<Form schema={s} loader={loader}/>);

        var CheckboxSelect = loader.loadType('CheckboxSelect');
        expect(CheckboxSelect).toExist('CheckboxSelect should be found');

        var cselects = byTypes(form);


    });
});