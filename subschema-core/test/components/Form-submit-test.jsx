"use strict";
import React from "react";
import {Form, ValueManager} from "Subschema";
import {renderToString, renderToStaticMarkup} from "react-dom/server";
import {into, expect, Simulate, byTags} from "subschema-test-support";


describe('components/Form/submit', function () {
    this.timeout(5000);

    it('should submit the form and have handler by name', function (done) {
        const schema = {
            template: 'ObjectTemplate',
            schema: {
                test: {
                    type: 'Text'

                },
                other: {
                    type: 'Text'

                }
            },
            fieldsets: [{
                template: 'FormTemplate',
                fields: 'test',
                name: 'form1'
            }, {
                template: 'FormTemplate',
                fields: 'other',
                name: 'form2'
            }]
        };
        const valueManager = ValueManager();
        valueManager.addSubmitListener(null, function (e, err, value, path) {
            e && e.preventDefault();
            expect(path).toBe('form2');
            done();
        });

        const content = into(<Form schema={schema} valueManager={valueManager}/>, true);
        const forms = byTags(content, 'form');
        expect(forms.length).toBe(2, 'found 2 forms');
        expect(forms[0].name).toBe('form1');
        expect(forms[1].name).toBe('form2');
        Simulate.submit(forms[1]);

    });

    it('should submit the form and have that is nested', function (done) {
        const schema = {
            template: 'ObjectTemplate',
            schema: {

                test: {
                    type: "Object",
                    template: 'FormTemplate',
                    subSchema: {
                        schema: {
                            me: 'Text'
                        }
                    }

                },
                you: {
                    type: "Object",
                    template: 'FormTemplate',
                    subSchema: {
                        schema: {
                            that: 'Text'
                        }
                    }

                }
            }
        };
        const valueManager = ValueManager();
        const paths = [];
        valueManager.addSubmitListener('you', function (e, err, value, path) {
            e && e.preventDefault();
            expect(path).toBe('you');
            paths.push(path);
        });

        valueManager.addSubmitListener('test', function (e, err, value, path) {
            e && e.preventDefault();
            expect(path).toBe('test');
            paths.push(path);
        });

        valueManager.addSubmitListener(null, function (e, err, value, path) {
            paths.push(path);
        });
        setTimeout(()=> {
            expect(paths[0]).toBe('you');
            expect(paths[1]).toBe('you');
            expect(paths[2]).toBe('test');
            expect(paths[3]).toBe('test');
            expect(paths.length).toBe(4);
            done();
        }, 200);
        const content = into(<Form schema={schema} valueManager={valueManager}/>, true);
        const forms = byTags(content, 'form');
        expect(forms.length).toBe(2, 'found 2 forms');
        Simulate.submit(forms[1]);
        Simulate.submit(forms[0]);

    });


});