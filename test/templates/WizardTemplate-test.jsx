"use strict";

import {React, byComponent,byComponents, byTag,change, into,click,check, TestUtils,expect, byTags, Simulate}  from 'subschema-test-support';
import {Form,ValueManager, templates, types} from 'Subschema';
import Sample from 'subschema-test-support-samples/Wizard';

describe('templates/WizardTemplate', function () {
    this.timeout(5000);

    it('should create a new form with a wizard template', function () {
        const valueManager = ValueManager({
            username: 'a@b.c',
            password: '123',
            confirmPassword: '123'
        });
        var root = into(<Form template="WizardTemplate" valueManager={valueManager} schema={Sample.schema}/>, true);
        expect(root).toExist();
        let template = byComponent(root, templates.WizardTemplate);
        expect(template).toExist('should have the template');
        let buttons = byComponent(template, templates.ButtonsTemplate);
        let next = byTag(buttons, 'button');
        click(next);

    });
    it('should create a new form with a wizard and stuff', function (done) {

        const valueManager = ValueManager({
            //  c1: true
        });

        function onSubmit(...args) {
            done();
        }

        var root = into(<Form template="WizardTemplate" valueManager={valueManager} onSubmit={onSubmit} schema={{
            schema:{
                c1:{type:'Checkbox',validators:['required']},
                c2:{type:'Checkbox',validators:['required']},
            },
            fieldsets:[{
                legend:"C1",
                fields:"c1"
            },{
                legend:"C2",
                fields:"c2"
            }]
        }}/>, true);
        expect(root).toExist();
        let template = byComponent(root, templates.WizardTemplate);
        expect(template).toExist('should have the template');
        click(byTag(template, 'button'));
        check(byTag(template, 'input'), true);
        click(byTag(template, 'button'));
        setTimeout(function () {
            check(byTag(template, 'input'), true);
            const btns = byTags(template, 'button');
            click(btns[1]);
            done();
        }, 1000);
        //  click(byTags(template, 'button')[1]);
        //  click(byTag(template, 'input'));


    });
    it('should create a new form with a wizard and submit with error', function (done) {
        const valueManager = ValueManager({
            //  c1: true
        });

        function onSubmit(e, err, value) {
            done(err == null ? 'Did not get error' : null);
        }

        var root = into(<Form valueManager={valueManager} onSubmit={onSubmit} schema={{
            template:"WizardTemplate",
            schema:{
                c1:{type:'Checkbox',validators:['required']},
                c2:{type:'Checkbox',validators:['required']},
            },
            fieldsets:[{
                legend:"C1",
                fields:"c1"
            },{
                legend:"C2",
                fields:"c2"
            }]
        }}/>, true);
        expect(root).toExist();
        done();
        /*  let template = byComponent(root, templates.WizardTemplate);
         expect(template).toExist('should have the template');
         click(byTag(template, 'button'));
         check(byTag(template, 'input'), true);
         click(byTag(template, 'button'));
         setTimeout(function () {
         const btns = byTags(template, 'button');
         click(btns[1]);

         }, 1000);*/
        //  click(byTags(template, 'button')[1]);
        //  click(byTag(template, 'input'));


    });
    it('should render multiple wizards', function (done) {
        const valueManager = ValueManager({
            //  c1: true
        });

        var root = into(<Form valueManager={valueManager} schema={{

            schema:{
                wiz1:{
                    type:"Object",
                    subSchema:{
                        schema:{
                            w1step1:"Text",
                            w1step2:"Text",
                        },
                        template:"WizardTemplate",
                        fieldsets:[{
                            "legend":"Wiz1 Step1",
                            "fields":"w1step1"
                        },{
                            "legend":"Wiz1 Step2",
                            "fields":"w1step2"
                        }]
                    }
                },
                wiz2:{
                    type:"Object",
                    subSchema:{
                        schema:{
                            w2step1:"Text",
                            w2step2:"Text",
                        },
                        template:"WizardTemplate",
                        fieldsets:[{
                            "legend":"Wiz2 Step1",
                            "fields":"w2step1"
                        },{
                            "legend":"Wiz2 Step2",
                            "fields":"w2step2"
                        }]
                    }
                }
            }

        }}/>, true);
        expect(root).toExist();
        const tmpls = byComponents(root, templates.WizardTemplate);
        expect(tmpls.length).toBe(2, 'should render both wizards');

//         click(byTag(tmpls[0], 'button'));
        change(byComponent(tmpls[0], types.Text), 'hello t1');
        click(byTag(tmpls[0], 'button'));
        setTimeout(()=> {
            const texts = byComponents(tmpls[0], types.Text)
            change(texts[0], 'hello t2');

            click(byTags(tmpls[0], 'button')[1]);

            done();
        }, 1200);
        /*
         setTimeout(function () {
         const btns = byTags(template, 'button');
         click(btns[1]);

         }, 1000);
         */
        //  click(byTags(template, 'button')[1]);
        //  click(byTag(template, 'input'));


    });
});
