import React from 'react';
import {templates} from 'subschema-component-modal';

import {
    into,
    expect,
}  from 'subschema-test-support';
import newSubschemaContext from 'subschema-test-support/lib/newSubschemaContext';


describe('subschema-component-modal', function () {
    this.timeout(50000);
    it('should render template with buttons', function () {
        //loader, schema, Subschema, React
        const {context, loader, Form} = newSubschemaContext();
        loader.addTemplate(templates);
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