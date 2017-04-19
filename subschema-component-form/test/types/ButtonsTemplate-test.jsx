import React from 'react';
import {findNode, into, expect, byComponents, byComponent}  from 'subschema-test-support';
import {types, templates} from 'subschema-component-form';
import newSubschemaContext from '../newSubschemaContext';

const {ButtonTemplate, ButtonsTemplate} = templates;

describe('templates/ButtonsTemplate', function () {
    it('should render buttons', function () {
        const {Form, context} = newSubschemaContext();
        const form = into(<Form {...context} schema={
            {
                schema: {},
                fieldsets: [{
                    buttons: ['one', 'two', 'three']
                }]
            }
        }/>, true);
        expect(form).toExist();
        const btns = byComponents(byComponent(form, ButtonsTemplate), ButtonTemplate, 3);
        for (let btn of btns) {
            const btnN = findNode(btn);
            expect(btnN.classList.contains('btn')).toBe(true);
        }
    });
    it('should render buttons with actions', function () {
        const {Form, context} = newSubschemaContext();

        const form = into(<Form {...context} schema={
            {
                schema: {},
                fieldsets: [{
                    buttons: [{label: 'one', primary: true}, 'two', 'three']
                }]
            }
        }/>, true);
        expect(form).toExist();
        const btns = byComponents(byComponent(form, ButtonsTemplate), ButtonTemplate, 3);
        for (let btn of btns) {
            const btnN = findNode(btn);
            expect(btnN.classList.contains('btn')).toBe(true, 'should have btn');
        }
        expect(findNode(btns[0]).classList.contains('btn-primary')).toBe(true, 'should have primary');
    })
});
