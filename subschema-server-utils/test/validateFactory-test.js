"use strict"
import {ValueManager, loaderFactory, validators} from "Subschema";
import {validateFactory} from 'subschema-server-utils';

import expect from "expect";

const loader = loaderFactory();
loader.addValidator(validators);

describe("validateFactory", function () {

    it('should validate required', function () {
        const validate = validateFactory({
            schema: {
                test: {
                    validators: ["required"]
                }
            }
        }, loader);

        expect(validate(ValueManager({
            test: null
        })).test[0].message).toBe('Required');

        expect(validate({
            test: 1
        })).toNotExist();

        expect(validate({
            test: null
        }).test[0].message).toBe('Required');

    });
    it('should validate nested with errors', function () {
        const validate = validateFactory({
            schema: {
                test: {
                    subSchema: {
                        schema: {
                            deep: {
                                validators: ["required"]
                            }
                        }
                    }
                }
            }
        }, loader);

        expect(validate(ValueManager({
            test: 'abc'
        }))['test.deep'][0].message).toBe('Required');

        expect(validate({
            test: {deep: 'abc'}
        })).toNotExist();

        expect(validate(ValueManager({}))['test.deep'][0].message).toBe('Required');

    });
    it('should not validate hidden conditional fields', function () {
        const validate = validateFactory({
            schema: {
                test: {},
                cond: {
                    validators: ['required'],
                    conditional: {
                        listen: "test"
                    }
                }
            }
        }, loader);

        expect(validate({
            test: false
        })).toNotExist();
        expect(validate({
            test: true
        }).cond[0].message).toBe('Required');

    });
    it('should validate lists of objects', function () {
        const validate = validateFactory({
            schema: {
                test: {
                    itemType: {
                        type: 'Object',
                        subSchema: {
                            answer: {
                                type: 'Text',
                                validators: ['required']
                            },

                            feel: {
                                type: 'Radio',
                                options: ['Good', 'Bad', 'Indifferent']
                            }
                        }
                    }
                }
            }
        }, loader);

        expect(validate({
            test: [{
                feel: 'Good'
            }]
        })['test.0.answer'][0].message).toBe('Required');

        expect(validate({
            test: [{
                feel: 'Good',
                answer: 'fine'
            }]
        })).toNotExist();

        expect(validate({
            test: [{
                feel: 'Good'
            }]
        })['test.0.answer'][0].message).toBe('Required');
    });

});