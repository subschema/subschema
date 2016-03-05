import {React, into,TestUtils,expect,byTypes, byClass, byTags,byComponents,byComponent,change, click, select, byId, Simulate}  from 'subschema-test-support';
import Subschema, {Form, types, ValueManager, templates} from 'Subschema';
var Questionaire = require('subschema-test-support-samples/Questionaire.js');

describe('public/Questionaire', function () {
    it('should render a Mixed with data', function () {
        const form = into(<Form
            schema={Questionaire.schema}
            value={Questionaire.data}
        />, true);
        expect(form).toExist();
        let mixed = byComponent(form, types.Mixed);
        expect(byComponents(mixed, templates.ListItemTemplate).length).toBe(2);
        let addBtn = byClass(mixed, 'btn-add')[0];
        click(addBtn);
        let createTemplate = byComponent(mixed, templates.CollectionCreateTemplate);

        let texts = byComponents(createTemplate, types.Text);
        change(texts[0], 'goodkey');
        change(texts[1], 'Bad');
        let radio = byTags(byComponent(createTemplate, types.Radio), 'input')[1];
        click(radio);
        click(byComponents(createTemplate, templates.ButtonTemplate)[1]);

        expect(byComponents(mixed, templates.ListItemTemplate).length).toBe(3);
    });
    it('should render a Mixed without data', function () {
        const form = into(<Form
            schema={Questionaire.schema}
        />, true);
        expect(form).toExist();
        let mixed = byComponent(form, types.Mixed);
        byComponents(mixed, templates.ListItemTemplate, 0);
        let addBtn = byComponent(mixed, templates.ButtonTemplate);
        click(addBtn);
        let createTemplate = byComponent(mixed, templates.CollectionCreateTemplate);

        let texts = byComponents(createTemplate, types.Text);
        change(texts[0], 'goodkey');
        change(texts[1], 'Bad');
        let radio = byTags(byComponent(createTemplate, types.Radio), 'input')[1];
        click(radio);
        click(byComponents(createTemplate, templates.ButtonTemplate)[1]);

        expect(byComponents(mixed, templates.ListItemTemplate).length).toBe(1);
    });
});