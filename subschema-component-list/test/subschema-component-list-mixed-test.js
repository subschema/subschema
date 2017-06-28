import React from 'react';
import {
    byClass, byComponent, byComponents, byTags, cleanUp, change, click, expect, into
} from 'subschema-test-support';
import newSubschemaContext from 'subschema-test-support/lib/newSubschemaContext';
import list from 'subschema-component-list';
import ButtonTemplate from 'subschema-component-form/lib/templates/ButtonTemplate';
import Radio from 'subschema-component-form/lib/types/Radio';
import Text from 'subschema-component-form/lib/types/Text';
import Mixed from 'subschema-component-list/lib/Mixed';
import ListItemTemplate from 'subschema-component-list/lib/ListItemTemplate';
import CollectionCreateTemplate from 'subschema-component-list/lib/CollectionCreateTemplate'

describe('subschema-component-list-mixed', function () {
  //  beforeEach(cleanUp);
    let form;

    it('should render a Mixed with data', function () {
        const { Form, loader, context:{valueManager} } = newSubschemaContext();
        loader.addLoader(list);
        valueManager.setValue(Questionaire.data)
        form = into(<Form
            key='form1'
            schema={Questionaire.schema}
            valueManager={valueManager}
            loader={loader}
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
        click(byComponents(byComponent(mixed, CollectionCreateTemplate), ButtonTemplate)[1]);

        expect(byComponents(mixed, ListItemTemplate).length,
            `Expect 3 components`).toBe(3);
    });
    //Disturbingly this fails when the other test is enabled.
    it.skip('should render a Mixed without data', function () {
        const { Form, loader, context:{valueManager} } = newSubschemaContext();
        loader.addLoader(list);

        form = into(<Form
            valueManager={valueManager}
            key='form2'
            schema={Questionaire.schema}
            loader={loader}
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
        click(byComponents(byComponent(mixed, CollectionCreateTemplate), ButtonTemplate)[1]);

        expect(byComponents(mixed, ListItemTemplate).length).toBe(1);
    });
});
const Questionaire = {
    schema: {
        schema: {
            questions: {
                type      : "Mixed",
                keyType   : 'Text',
                title     : 'Questioniare',
                labelKey  : 'answer',
                canEdit   : true,
                canDelete : true,
                canAdd    : true,
                valueType : {
                    type     : 'Object',
                    subSchema: {
                        answer: 'Text',
                        feel  : {
                            type   : 'Radio',
                            options: ['Good', 'Bad', 'Indifferent']
                        }
                    }
                }
            }
        }
    },
    data  : {
        questions: {
            question1: {
                answer: 'I know nothing',
                feel  : 'Good'
            },
            question2: {
                answer: 'I still know nothing',
                feel  : 'bad'
            }
        }
    },
    errors: {
        'questions.question2.answer': [{
            message: 'Are you sure?'
        }]
    }
};
