"use strict";

import {React, click, findNode, change,  into,TestUtils,expect,byComponents, byTag, byTags, byComponent, select,  Simulate}  from 'subschema-test-support';
import Subschema, {Form, types, templates, ValueManager, loaderFactory, DefaultLoader} from 'Subschema';

const {ButtonTemplate, ButtonsTemplate} = templates;

describe('templates/ButtonsTemplate', function () {
    it('should render buttons', function () {

        const form = into(<Form schema={
            {
            schema:{},
            fieldsets:[{
                buttons:['one', 'two', 'three']
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

        const form = into(<Form schema={
            {
            schema:{},
            fieldsets:[{
                buttons:[{label:'one', primary:true}, 'two', 'three']
            }]
            }
        }/>, true);
        expect(form).toExist();
        const btns = byComponents(byComponent(form, ButtonsTemplate), ButtonTemplate, 3);
        for (let btn of btns) {
            const btnN = findNode(btn);
            expect(btnN.classList.contains('btn')).toBe(true);
        }
        expect(findNode(btns[0]).classList.contains('btn-primary')).toBe(true, 'should have primary');
    })
});