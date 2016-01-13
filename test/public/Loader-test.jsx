"use strict";

import {React, into,TestUtils,expect, byId, byTypes, Simulate}  from 'subschema-test-support';
import loaderTestSetup from 'subschema-test-support/samples/Loader-setup.js';
import LoaderTest from 'subschema-test-support/samples/Loader.js'
import Subschema,{Form,  ValueManager, loaderFactory, DefaultLoader, decorators}  from 'Subschema';


describe('public/loader', ()=> {


    it('should load a custom type', ()=> {
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