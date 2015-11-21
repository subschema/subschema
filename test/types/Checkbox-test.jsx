import {React, check, into,intoWithContext, findNode, change, TestUtils,expect, Simulate} from '../support';
import {Form, ValueManager, types} from 'Subschema';
var {Checkbox} = types;

describe('Checkbox', function () {
    it('should create a form', function () {
        var root = into(<Form schema={{schema:{
            c1:'Checkbox',
            c2:{
                type:'Checkbox'
            }
        }}}/>);
        expect(root).toExist();
        var ret = root.getValue();
        expect(ret.c1).toNotExist();
        expect(ret.c2).toNotExist();

    });
    it('should trigger on and off if the value matches', function(){
        var valueManager = ValueManager({test:'hello'});
        var checkbox = intoWithContext(<Checkbox path="test" value="nolo"/>, {valueManager});
        expect(findNode(checkbox).checked).toBe(false);
        check(findNode(checkbox), true);
        expect(valueManager.path('test')).toBe('nolo');


    });

    it('should trigger on and off if without a value matches', function(){
        var valueManager = ValueManager({test:'hello'});
        var checkbox = intoWithContext(<Checkbox path="test" />, {valueManager});
        expect(findNode(checkbox).checked).toBe(true);
        check(findNode(checkbox), false);
        expect(valueManager.path('test')).toNotExist();
        check(findNode(checkbox), true);

    });
});