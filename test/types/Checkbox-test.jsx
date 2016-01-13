"use strict";

import {React, check, intoWithState, into, byType, findNode, change, TestUtils,expect, Simulate} from 'subschema-test-support';
import {Form, ValueManager, types} from 'Subschema';

const {Checkbox} = types;


describe('Checkbox', function () {
    it('should create a form', function () {
        var valueManager = ValueManager();
        var root = into(<Form valueManager={valueManager} schema={{schema:{
            c1:'Checkbox',
            c2:{
                type:'Checkbox'
            }
        }}}/>);
        expect(root).toExist('form should exist');
        var ret = root.getValue();
        expect(ret.c1).toNotExist('c1 should not exist');
        expect(ret.c2).toNotExist('c2 should not exist');
        valueManager.update('c1', true);
        var ret = root.getValue();
        expect(ret.c1).toBe(true, 'should update value');

    });

    it('should trigger on and off if the value matches', function () {
        var changes = [], onChange = (value)=> {
            state.setState({value});
        }, {state, child} = intoWithState(<Checkbox value="nolo" onChange={onChange}/>), checkbox = child;

        expect(findNode(checkbox).checked).toBe(true);
        check(findNode(checkbox), true);
        expect(state.state.value).toBe('nolo', 'state should update');
        check(findNode(checkbox), false);
        expect(state.state.value).toBe(null, 'state should update');
        expect(findNode(checkbox).checked).toBe(false, 'should not be checked');


    });

});