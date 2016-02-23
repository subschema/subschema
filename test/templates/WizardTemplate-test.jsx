"use strict";

import {React, byComponent, byTag, into,click,check, TestUtils,expect, byTags, Simulate}  from 'subschema-test-support';
import {Form,ValueManager, templates} from 'Subschema';
import Sample from 'subschema-test-support/samples/Wizard';

describe('templates/Wizard', function () {
    this.timeout(50000);
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
        let next = byTag(template, 'button');

    });
    it('should create a new form with a wizard and stuff', function (done) {
        const valueManager = ValueManager({
            //  c1: true
        });
        function onSubmit(...args){
            console.log('submit', ...args);
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
        setTimeout(function(){
            check(byTag(template, 'input'), true);
            const btns = byTags(template, 'button');
            click(btns[1]);

        }, 1000);
      //  click(byTags(template, 'button')[1]);
      //  click(byTag(template, 'input'));


    });
    it('should create a new form with a wizard and submit with error', function (done) {
        const valueManager = ValueManager({
            //  c1: true
        });
        function onSubmit(e, err, value){
            done(err == null ? 'Did not get error' : null);
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
        setTimeout(function(){
            const btns = byTags(template, 'button');
            click(btns[1]);

        }, 1000);
        //  click(byTags(template, 'button')[1]);
        //  click(byTag(template, 'input'));


    });

});
