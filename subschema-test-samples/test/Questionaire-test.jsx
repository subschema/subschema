import React from 'react';
import {
    into,
    expect,
    byClass,
    byTags,
    byComponents,
    byComponent,
    change,
    click
}  from 'subschema-test-support';
import {newSubschemaContext} from 'subschema';
import {Questionaire} from 'subschema-test-samples';

describe('public/Questionaire', function () {
    let loader,
        Form,
        Mixed,
        CollectionCreateTemplate,
        ListItemTemplate,
        Text,
        Radio,
        ButtonTemplate;

    beforeEach(function () {
        const Subschema = newSubschemaContext();
        loader = Subschema.loader;
        Form = Subschema.Form;
        Mixed = loader.loadType('Mixed');
        ListItemTemplate = loader.loadTemplate('ListItemTemplate');
        Text = loader.loadType('Text');
        Radio = loader.loadType('Radio');
        CollectionCreateTemplate = loader.loadTemplate('CollectionCreateTemplate');
        ButtonTemplate = loader.loadTemplate('ButtonTemplate');
    });

    it('should render a Mixed with data', function () {
        const form = into(<Form
            schema={Questionaire.schema}
            value={Questionaire.data}
        />, true);
        expect(form).toExist();
        let mixed = byComponent(form, Mixed);
        expect(byComponents(mixed, ListItemTemplate).length).toBe(2);
        let addBtn = byClass(mixed, 'btn-add')[0];
        click(addBtn);
        let createTemplate = byComponent(mixed, CollectionCreateTemplate);

        let texts = byComponents(createTemplate, Text);
        change(texts[0], 'goodkey');
        change(texts[1], 'Bad');
        let radio = byTags(byComponent(createTemplate, Radio), 'input')[1];
        click(radio);
        click(byComponents(createTemplate, ButtonTemplate)[1]);

        expect(byComponents(mixed, ListItemTemplate).length, `Expect 3 components`).toBe(3);
    });
    it('should render a Mixed without data', function () {
        const form = into(<Form
            schema={Questionaire.schema}
        />, true);
        expect(form).toExist();
        let mixed = byComponent(form, Mixed);
        byComponents(mixed, ListItemTemplate, 0);
        let addBtn = byComponent(mixed, ButtonTemplate);
        click(addBtn);
        let createTemplate = byComponent(mixed, CollectionCreateTemplate);

        let texts = byComponents(createTemplate, Text);
        change(texts[0], 'goodkey');
        change(texts[1], 'Bad');
        let radio = byTags(byComponent(createTemplate, Radio), 'input')[1];
        click(radio);
        click(byComponents(createTemplate, ButtonTemplate)[1]);

        expect(byComponents(mixed, ListItemTemplate).length).toBe(1);
    });
});