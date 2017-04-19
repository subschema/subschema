import React from 'react';
import {templates, styles} from 'subschema-component-modal';

import {
    click,
    change,
    findNode,
    into,
    TestUtils,
    expect,
    byComponents,
    byTag,
    byTags,
    byComponent,
    select,
    Simulate
}  from 'subschema-test-support';
import newSubschemaContext from 'subschema-test-support/lib/newSubschemaContext';


describe('subschema-component-modal', function () {
    this.timeout(50000);
    it('should render template with buttons', function () {
        //loader, schema, Subschema, React
        const {context, loader, Form} = newSubschemaContext();
        loader.addTemplate(templates);
        loader.addStyle(styles);
        const form = into(<Form schema={{
            schema: {
                test: 'Text'
            },
            fieldsets: [
                {
                    template: "ModalTemplate",
                    path: 'toggle',
                    legend: 'hello',
                    fields: ['test'],
                    buttons: ['close', 'cancel', 'submit']
                }
            ]
        }} {...context}/>, true);
        expect(form).toExist();


    });
});