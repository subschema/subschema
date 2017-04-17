"use strict";
import React from 'react';
import {
    byComponent,
    byTag,
    into,
    click,
    expect,
}  from 'subschema-test-support';
import {Form, ValueManager, templates, types} from 'Subschema';
import {Wizard} from 'subschema-test-samples';

describe('public/Wizard', function () {
    this.timeout(5000);
    it('should create a new form with a wizard template', function () {
        const valueManager = ValueManager({
            username: 'a@b.c',
            password: '123',
            confirmPassword: '123'
        });
        var root = into(<Form template="WizardTemplate" valueManager={valueManager} schema={Wizard.schema}/>, true);
        expect(root).toExist();
        let template = byComponent(root, templates.WizardTemplate);
        expect(template).toExist('should have the template');
        let buttons = byComponent(template, templates.ButtonsTemplate);
        let next = byTag(buttons, 'button');
        click(next);
    });
});
