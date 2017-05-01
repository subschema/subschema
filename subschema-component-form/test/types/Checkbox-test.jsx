import React from 'react';
import {
    check,
    intoWithState,
    into,
    byTags,
    findNode,
    byComponent,
    change,
    TestUtils,
    expect,
    Simulate
} from 'subschema-test-support';
import {types, templates} from 'subschema-component-form';
import newSubschemaContext from 'subschema-test-support/lib/newSubschemaContext';
const {Checkbox} = types;
const {EditorTemplate} = templates;


describe('types/Checkbox', function () {
    it('should create a form', function () {
        const {Form, valueManager} = newSubschemaContext();
        var root = into(<Form valueManager={valueManager} schema={{
            schema: {
                c1: 'Checkbox',
                c2: {
                    type: 'Checkbox'
                }
            }
        }}/>);
        expect(root).toExist('form should exist');
        var ret = root.getValue();
        expect(ret.c1).toNotExist('c1 should not exist');
        expect(ret.c2).toNotExist('c2 should not exist');
        valueManager.update('c1', true);
        var ret = root.getValue();
        expect(ret.c1).toBe(true, 'should update value');

    });

    it('should trigger on and off if the value matches', function () {
        const onChange = (value = false) => {
            state.setState({value});
        };
        const {state, child} = intoWithState(<Checkbox value="nolo" onChange={onChange}/>, {value:'nolo'}, true), checkbox = child;

        expect(findNode(checkbox).checked).toBe(true);
        check(findNode(checkbox), true);
        expect(state.state.value).toBe('nolo', 'state should update');
        check(findNode(checkbox), false);
        expect(state.state.value).toBe(null, 'state should update');
        expect(findNode(checkbox).checked).toBe(false, 'should not be checked');

    });
    it('should validate on change', function () {
        const {Form, valueManager} = newSubschemaContext();
        var root = into(<Form valueManager={valueManager} schema={{
            schema: {
                checkbox: {
                    type: 'Checkbox',
                    validators: ['required']
                }
            }
        }}/>, true);
        const template = byComponent(root, EditorTemplate);
        expect(root).toExist('form should exist');
        const checkbox = byComponent(root, Checkbox);
        expect(byTags(template, 'p', 1)[0].innerHTML).toBe('');
        valueManager.validate();
        let p = byTags(template, 'p')[0];
        expect(p.innerHTML).toBe('Required');
        check(checkbox, true);
        expect(byTags(template, 'p', 1));

    });
});
