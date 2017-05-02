import React from 'react';
import {
    byComponent,
    byTag,
    into,
    click,
    expect,
}  from 'subschema-test-support';
import {newSubschemaContext} from 'subschema';
import {Wizard} from 'subschema-test-samples';
import ValueManager from 'subschema-valuemanager';

describe('subschema-test-samples/Wizard', function () {
    this.timeout(5000);
    it('should create a new form with a wizard template', function () {
        const Subschema = newSubschemaContext();
        const {Form, loader} = Subschema;
        const ButtonsTemplate = loader.loadTemplate('ButtonsTemplate');
        const WizardTemplate = loader.loadTemplate('WizardTemplate');
        Subschema.valueManager = ValueManager({
            username: 'a@b.c',
            password: '123',
            confirmPassword: '123'
        });
        var root = into(<Form template="WizardTemplate" valueManager={Subschema.valueManager}
                              schema={Wizard.schema}/>, true);
        expect(root).toExist();
        let template = byComponent(root, WizardTemplate);
        expect(template).toExist('should have the template');
        let buttons = byComponent(template, ButtonsTemplate);
        let next = byTag(buttons, 'button');
        click(next);
    });
});
