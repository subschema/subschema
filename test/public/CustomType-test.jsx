import {React, into,TestUtils,expect,byTypes, byId, select,  Simulate}  from '../support';
import Subschema, {Form, types, ValueManager} from 'Subschema';

var Select = types.Select;
var CustomTypeSetup = require('../../public/samples/CarMake-setup.js');
var CustomType = require('../../public/samples/CarMake.js');

describe('CustomType', function () {
    it('should render', function () {
        var schema = CustomType.schema;
        //loader, schema, Subschema, React
        var loader = Subschema.loaderFactory([Subschema.DefaultLoader]);
        expect(CustomTypeSetup).toExist('CarMake-setup should load');
        var valueManager = ValueManager();
        CustomTypeSetup(loader, schema, Subschema, React, valueManager);

        var form = into(<Form schema={schema} valueManager={valueManager}/>);


    })
});