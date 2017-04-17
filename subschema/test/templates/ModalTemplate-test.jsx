"use strict";
import {React, click, change,findNode,  into,TestUtils,expect,byComponents, byTag, byTags, byComponent, select,  Simulate}  from 'subschema-test-support';
import Subschema, {Form, types, templates, ValueManager, loaderFactory, DefaultLoader} from 'Subschema';

const {ModalTemplate} = templates;

describe('templates/ModalTemplate', function () {
    this.timeout(50000);
    it('should render template with buttons', function () {
        //loader, schema, Subschema, React
        const valueManager = ValueManager();
        const form = into(<Form schema={{
            schema:{
                test:'Text'
            },
            fieldsets:[
            {
                template:"ModalTemplate",
                path:'toggle',
                legend:'hello',
                fields:['test'],
                buttons:['close', 'cancel', 'submit']
            }
            ]
        }} valueManager={valueManager}/>, true);
        expect(form).toExist();


    });
});