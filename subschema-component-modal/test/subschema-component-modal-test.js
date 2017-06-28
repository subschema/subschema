import React from 'react';
import { templates } from 'subschema-component-modal';
import {
    byClass, byComponent, byComponents, change, check, click, expect, into
} from 'subschema-test-support';
import newSubschemaContext from 'subschema-test-support/lib/newSubschemaContext';
import ButtonTemplate from 'subschema-component-form/lib/templates/ButtonTemplate';
import Checkbox from 'subschema-component-form/lib/types/Checkbox';
import Text from 'subschema-component-form/lib/types/Text';


describe('subschema-component-modal', function () {
    this.timeout(50000);

    it('should render template with buttons', function () {
        //loader, schema, Subschema, React
        const { context, loader, Form } = newSubschemaContext();
        loader.addTemplate(templates);
        const form = into(<Form schema={{
            schema   : {
                test: 'Text'
            },
            fieldsets: [
                {
                    template: 'ModalTemplate',
                    legend  : 'hello',
                    fields  : ['test'],
                    buttons : ['close', 'cancel', 'submit']
                }
            ]
        }}/>, true);
        expect(form).toExist();
    });

    it('should render template with and submit validate', function () {
        //loader, schema, Subschema, React`
        const { loader, valueManager, Form, ValueManager } = newSubschemaContext();
        loader.addTemplate(templates);
        const onSubmit = (e, err, value) => {
            e && e.preventDefault();
        };
        const form     = into(<Form
            onSubmit={onSubmit} schema={{
            schema   : {
                test     : {
                    type      : 'Text',
                    validators: ['required']
                },
                showModal: {
                    type: 'Checkbox'
                }
            },
            fieldsets: [
                'showModal',
                {
                    template   : 'ModalTemplate',
                    conditional: {
                        listen   : 'showModal',
                        operation: 'truthy',
                        dismiss  : 'showModal'
                    },
                    legend     : 'hello',
                    fields     : ['test'],
                    buttons    : [{
                        label : 'Cancel',
                        name  : 'showModal',
                        value : false,
                        action: 'close'
                    }, {
                        label: 'Click Me',
                        name : 'showModal',

                        primary: true,
                        action : 'submit'
                    }]
                }
            ]
        }} loader={loader} valueManager={valueManager}/>, true);


        expect(form).toExist();

        const checkbox = (checked = true) => check(
            byComponent(form, Checkbox), checked);
        const cancel   = () => click(byComponents(form, ButtonTemplate)[0]);
        const submit   = () => click(byComponents(form, ButtonTemplate)[1]);
        const close    = () => click(byClass(form, 'close'));
        const text     = (value) => change(byComponent(form, Text), value);
        const value    = (path, expected) => {
            const v = valueManager.path(path);
            if (expected != null) {
                return expect(v).toBe(expected);
            }
            return expect(v).toNotExist();

        };
        checkbox();
        submit();
        expect(valueManager.getErrors().test.length).toBe(1);
        cancel();

        value('test', null);

        checkbox();

        text('goodbye');

        submit();

        value('test', 'goodbye');

        checkbox();

        text('goodbye world');


        value('test', 'goodbye world');

        cancel();

        value('test', 'goodbye');

        checkbox();

        text('goodbye world');

        close();

        value('test', 'goodbye');

        checkbox();

        text('gonna click it');

        //closes it tests unstash on destroy
        checkbox(false);

        value('test', 'goodbye');

    });
    it('should render template with and submit validate minimal',
        function () {
            //loader, schema, Subschema, React
            const { valueManager, loader, Form, ValueManager } = newSubschemaContext();
            loader.addTemplate(templates);
            const onSubmit = (e, err, value) => {
                e && e.preventDefault();
            };
            const form     = into(<Form
                onSubmit={onSubmit} schema={{
                schema   : {
                    test     : {
                        type      : 'Text',
                        validators: ['required']
                    },
                    showModal: {
                        type: 'Checkbox'
                    }
                },
                fieldsets: [
                    'showModal',
                    {
                        template   : 'ModalTemplate',
                        conditional: 'showModal',
                        legend     : 'hello',
                        fields     : ['test'],
                        buttons    : [{
                            label : 'Cancel',
                            name  : 'showModal',
                            value : false,
                            action: 'close'
                        }, {
                            label: 'Click Me',
                            name : 'showModal',

                            primary: true,
                            action : 'submit'
                        }]
                    }
                ]
            }} valueManager={valueManager} loader={loader}/>, true);


            expect(form).toExist();

            const checkbox = (checked = true) => check(
                byComponent(form, Checkbox), checked);
            const cancel   = () => click(byComponents(form, ButtonTemplate)[0]);
            const submit   = () => click(byComponents(form, ButtonTemplate)[1]);
            const close    = () => click(byClass(form, 'close'));
            const text     = (value) => change(byComponent(form, Text), value);
            const value    = (path, expected) => {
                const v = valueManager.path(path);
                if (expected != null) {
                    return expect(v).toBe(expected);
                }
                return expect(v).toNotExist();

            };
            checkbox();
            submit();
            expect(valueManager.getErrors().test.length).toBe(1);

            cancel();

            value('test', null);

            checkbox();

            text('goodbye');

            submit();

            value('test', 'goodbye');

            checkbox();

            text('goodbye world');

            value('test', 'goodbye world');

            cancel();

            value('test', 'goodbye');

            checkbox();

            text('goodbye world');

            close();

            value('test', 'goodbye');

            checkbox();

            text('gonna click it');

            //closes it tests unstash on destroy
            checkbox(false);

            value('test', 'goodbye');

        });
    it('should render template with and submit very minimal',
        function () {
            //loader, schema, Subschema, React
            const { valueManager, loader, Form, ValueManager } = newSubschemaContext();
            loader.addTemplate(templates);
            const onSubmit = (e, err, value) => {
                e && e.preventDefault();
            };
            const form     = into(<Form onSubmit={onSubmit} schema={{
                schema   : {
                    test : {
                        type      : 'Text',
                        validators: ['required']
                    },
                    other: 'Text'
                },
                fieldsets: [
                    {
                        template   : 'ModalTemplate',
                        conditional: 'showModal',
                        fields     : ['test']
                    },
                    'other'
                ]
            }} loader={loader} valueManager={valueManager}/>, true);


            expect(form).toExist();

            const checkbox = (checked = true) => valueManager.update(
                'showModal', checked);
            const cancel   = () => click(byComponents(form, ButtonTemplate)[0]);
            const submit   = () => click(byComponents(form, ButtonTemplate)[1]);
            const close    = () => click(byClass(form, 'close'));
            const text     = (value) => change(byComponents(form, Text)[0],
                value);
            const value    = (path, expected) => {
                const v = valueManager.path(path);
                if (expected != null) {
                    return expect(v).toBe(expected);
                }
                return expect(v).toNotExist();

            };
            checkbox();
            submit();
            expect(valueManager.getErrors().test.length).toBe(1);

            cancel();

            value('test', null);

            checkbox();

            text('goodbye');

            submit();

            value('test', 'goodbye');

            checkbox();

            text('goodbye world');

            value('test', 'goodbye world');

            cancel();

            value('test', 'goodbye');

            checkbox();

            text('goodbye world');

            close();

            value('test', 'goodbye');

            checkbox();

            text('gonna click it');

            //closes it tests unstash on destroy
            checkbox(false);

            value('test', 'goodbye');

        });

    it('should render as a field template',
        function () {
            //loader, schema, Subschema, React
            const { valueManager, loader, Form, ValueManager } = newSubschemaContext();
            loader.addTemplate(templates);
            const onSubmit = (e, err, value) => {
                e && e.preventDefault();
            };
            const form     = into(<Form onSubmit={onSubmit} schema={{
                schema   : {
                    hello    : {
                        type       : 'Object',
                        template   : 'ModalTemplate',
                        conditional: 'showModal',
                        validators : ['required'],
                        title      : 'Hello From Title',
                        fields     : ['test'],
                        subSchema  : {
                            schema: {
                                test: {
                                    type      : 'Text',
                                    validators: ['required']
                                }
                            }
                        }
                    },
                    showModal: 'Checkbox'
                },
                fieldsets: [
                    'hello',
                    'showModal'
                ]
            }} valueManager={valueManager} loader={loader}/>, true);


            expect(form).toExist();

            const checkbox = (checked = true) => valueManager.update(
                'showModal', checked);
            const cancel   = () => click(byComponents(form, ButtonTemplate)[0]);
            const submit   = () => click(byComponents(form, ButtonTemplate)[1]);
            const close    = () => click(byClass(form, 'close'));
            const text     = (value) => change(byComponents(form, Text)[0],
                value);
            const value    = (path, expected) => {
                const v = valueManager.path(path);
                if (expected != null) {
                    return expect(v).toBe(expected);
                }
                return expect(v).toNotExist();

            };
            checkbox();
            submit();
            // expect(context.valueManager.getErrors()['hello.test'].length).toBe(1);

            cancel();
            value('test', null);

            checkbox();

            text('goodbye');

            submit();

            value('hello.test', 'goodbye');

            checkbox();

            text('goodbye world');

            value('hello.test', 'goodbye world');

            cancel();

            value('hello.test', 'goodbye');

            checkbox();

            text('goodbye world');

            close();

            value('hello.test', 'goodbye');

            checkbox();

            text('gonna click it');

            //closes it tests unstash on destroy
            checkbox(false);

            value('hello.test', 'goodbye');

        });
});
