import {React, into,TestUtils,expect, Simulate} from '../support';
import {Form} from 'subschema';

describe('Checkbox', function () {
    it('should create a form', function () {
        var root = into(<Form schema={{schema:{
            c1:'Checkbox',
            c2:{
                type:'Checkbox'
            }
        }}} />);
        expect(root).toExist();
        var ret = root.getValue();
        expect(ret.c1).toNotExist();
        expect(ret.c2).toNotExist();

    });
});