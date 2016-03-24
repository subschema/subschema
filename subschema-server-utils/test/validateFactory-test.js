"use strict"
import {ValueManager, loaderFactory, validators} from "Subschema";
import {validateFactory} from "subschema-server-utils";
import expect from "expect";

const loader = loaderFactory();
loader.addValidator(validators);

function all(...args) {
    return Promise.all(args);
}


describe("validateFactory", function () {
    this.timeout(50000);
    it('should validate required', function () {
        const validate = validateFactory({
            schema: {
                test: {
                    validators: ["required"]
                }
            }
        }, loader);

        return all(
            validate(ValueManager({
                test: null
            })).then((r)=>expect(r.test[0].message).toBe('Required')),

            validate({
                test: 1
            }).then(r=>expect(r).toNotExist()),

            validate({
                test: null
            }).then(r=>expect(r.test[0].message).toBe('Required'))
        );

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
        return all(
            validate(ValueManager({
                test: 'abc'
            })).then(r=> expect(r['test.deep'][0].message).toBe('Required')),

            validate({
                test: {deep: 'abc'}
            }).then(r=>expect(r).toNotExist()),

            validate(ValueManager({})).then(r=>expect(r['test.deep'][0].message).toBe('Required'))
        );
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

        return all(
            validate({
                test: false
            }).then(r=>expect(r).toNotExist()),
            validate({
                test: true
            }).then(r=>expect(r.cond[0].message).toBe('Required'))
        );

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

        return all(
            validate({
                test: [{
                    feel: 'Good'
                }]
            }).then(r=> expect(r['test.0.answer'][0].message).toBe('Required')),

            validate({
                test: [{
                    feel: 'Good',
                    answer: 'fine'
                }]
            }).then(r=>expect(r).toNotExist()),

            validate({
                test: [{
                    feel: 'Good'
                }]
            }).then(r=>expect(r['test.0.answer'][0].message).toBe('Required'))
        );
    });
    it('should resolve asyncly', function () {
        var loader = loaderFactory();

        loader.addValidator('async', function asyncly(options) {
            options = {timeout: 300, message: 'Not Right', ...options};
            return function async$config(val) {
                return new Promise((result, reject)=> {
                    setTimeout(()=> {
                        if (val !== options.value) {
                            return result({message: options.message});
                        }
                        result();
                    }, options.timeout);
                });
            }
        });
        const validate = validateFactory({
            schema: {
                test: {
                    validators: [{type: "async", value: 1, message: 'Not Right'}]
                }
            }
        }, loader);

        return all(validate({}).then(r=> {
            expect(r.test[0].message).toBe('Not Right')
        }), validate({test: 1}).then(r=> {
            expect(r).toNotExist();
        }));

    });
    it('should deep resolve asyncly', function () {
        var loader = loaderFactory();

        loader.addValidator('async', function asyncly(options) {
            options = {timeout: 300, message: 'Not Right', ...options};
            return function async$config(val) {
                return new Promise((result, reject)=> {
                    setTimeout(()=> {
                        if (val !== options.value) {
                            return result({message: options.message});
                        }
                        result();
                    }, options.timeout);
                });
            }
        });
        const validate = validateFactory({
            schema: {
                test: {
                    validators: [{type: "async", value: 1, message: 'Not Right'}]
                },
                other: {
                    subSchema: {
                        more: {
                            validators: [{type: "async",value: 2, timeout: 400, message: 'Still Not Right'}]
                        }
                    }
                }
            }
        }, loader);

        return all(validate({}).then(r=> {
            expect(r.test[0].message).toBe('Not Right');
            expect(r['other.more'][0].message).toBe('Still Not Right');

        }), validate({test: 1}).then(r=> {
            expect(r.test).toNotExist();
            expect(r['other.more'][0].message).toBe('Still Not Right');
        }), validate({test: 1, other: {more: 2}}).then(r=> {
            expect(r).toNotExist();
        }));

    });
});