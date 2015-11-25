import {React, into,TestUtils,expect, byId, byTypes, Simulate}  from '../support';

import Subschema from 'Subschema';


var loaderTestSetup = require('../../public/samples/Loader-setup.jsx');
var LoaderTest = require('../../public/samples/Loader.jsx');


describe('Loader Example', ()=> {


    it('should load a custom type', ()=> {

        var {Form, loader, ValueManager, decorators} = Subschema;

        var schema = LoaderTest.schema;
        var valueManager = ValueManager();
        loaderTestSetup(loader, schema, Subschema, React, valueManager);

        var s = schema.replace(/^"(.*)\"$/, '$1');
        console.log('schema', s);
        var form = into(<Form schema={s} loader={loader} />, true);

        var CheckboxSelect = loader.loadType('CheckboxSelect');
        expect(CheckboxSelect).toExist('CheckboxSelect should be found');

        var cselects = byTypes(form);


    });
});