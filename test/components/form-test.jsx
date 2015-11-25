"use strict";
import {React, into,TestUtils,expect, Simulate,byTag, byType, notByType, click} from '../support';
import {loader,Form, templates} from 'Subschema';
var {EditorTemplate, ButtonTemplate} = templates;

describe('Form', function () {
    this.timeout(50000);
    it('should create a form with a schema and value and triggered error only after having been valid', function (done) {
        var value = {}, schema = {
            schema: {
                name: {
                    type: 'Text',
                    validators: ['email']
                }
            }
        }, errors = {};

        var root = into(<Form value={value} schema={schema} errors={errors} loader={loader}/>);
        var edit = TestUtils.scryRenderedComponentsWithType(root, EditorTemplate)[0];
        var input = byTag(edit, 'input');
        Simulate.blur(input);

        expect(edit.props.error).toNotExist();

        /*
         Simulate.change(input, {target: {value: 'dude@g'}});
         expect(field.state.errors.name).toNotExist();
         */

        Simulate.change(input, {target: {value: 'dude@g.com'}});

        expect(edit.props.error).toNotExist();

        Simulate.change(input, {target: {value: 'dude@g'}});
        expect(edit.props.error).toExist();
        Simulate.change(input, {target: {value: 'dude@g.com'}});

        expect(edit.props.error).toNotExist();


        Simulate.change(input, {target: {value: 'dude@g'}});

        expect(edit.props.error).toExist();

        Simulate.blur(input);
        expect(edit.props.error).toExist();

        Simulate.change(input, {target: {value: 'dude@go.com'}});
        expect(edit.props.error).toNotExist();

        Simulate.change(input, {target: {value: 'dude@g'}});
        expect(edit.props.error).toExist();

        Simulate.change(input, {target: {value: ''}});
        expect(edit.props.error).toNotExist();
        done();
    });
    //This should give a warning. and it does, but it makes debuuging harder so let's skip it and leave it for
    // documentation sake.
    it.skip('should create a form', function () {

        var root = into(<Form />);
        expect(root).toExist();
    });
    it('should create a form with a schema', function () {

        var root = into(<Form schema={{schema:{
            name:'Text'
        }}}/>);

        expect(root).toExist();
        var edit = TestUtils.scryRenderedComponentsWithType(root, EditorTemplate)[0]
        expect(edit).toExist();
    });
    it('should create a form with a schema and value', function () {

        var root = into(<Form value={{name:'Joe'}} schema={{schema:{
            name:'Text'
        }}}/>);

        expect(root).toExist();
        var edit = TestUtils.scryRenderedComponentsWithType(root, EditorTemplate)[0]

        expect(edit).toExist();
        expect(root.getValue().name).toEqual('Joe');
    });

    it('should create a form with a schema and value and error', function () {
        var value = {
            name: 'Joe'
        }, schema = {
            schema: {
                name: 'Text'
            }
        }, errors = {
            name: [{message: 'Is lousy', type: 'GENERIC'}]
        };
        var root = into(<Form value={value} schema={schema} errors={errors}/>);
        var edit = TestUtils.scryRenderedComponentsWithType(root, EditorTemplate)[0]
        expect(edit.props.error).toEqual('Is lousy');
    });

    it('should create a form with a schema and value and triggered error', function () {
        var value = {}, schema = {
            schema: {
                name: {
                    type: 'Text',
                    validators: ['required']
                }
            }
        }, errors = {};

        var root = into(<Form value={value} schema={schema} errors={errors}/>);
        var edit = TestUtils.scryRenderedComponentsWithType(root, EditorTemplate)[0]
        var input = byTag(edit, 'input');
        Simulate.blur(input);
        expect(edit.props.error).toEqual('Required');
    });

    it('should create a nested form with multiple errors', function () {
        var value = {}, schema = {
            schema: {
                name: {
                    type: 'Text',
                    validators: ['email']
                },
                test: {
                    type: 'Object',
                    subSchema: {
                        stuff: {
                            type: 'Text',
                            validators: ['required']
                        },
                        more: {
                            type: 'Object',
                            subSchema: {
                                andMore: {
                                    type: 'Text',
                                    validators: ['required']
                                }
                            }
                        }
                    }
                }
            }
        }, errors = {
            'name': [{message: 'Error Not My Name'}],
            'test.stuff': [{message: 'Error Not My stuff'}],
            'test.more.andMore': [{message: 'Error And More'}]
        }
        var root = into(<Form value={value} schema={schema} errors={errors}/>);
        //     expect(root.refs.name.state.errors[0].message).toEqual('Error Not My Name');
        //    expect(root.refs.test.refs.field.state.errors.name[0].message).toEqual('Error Not My Name');

//        expect(root.refs.test.refs.field.refs.more.fstate.errors.name[0].message).toEqual('Error Not My Name');


        /*    var input = root.refs.name.refs.field.refs.input,
         field = root.refs.name;
         Simulate.blur(input);

         expect(field.state.errors.name).toNotExist();*/

    });
    it('should create a nested form with when setErrors is called', function () {
        var msg1 = 'Error Not My Name', msg2 = 'Error Not My stuff', msg3 = 'Error And More';
        var value = {}, schema = {
            schema: {
                name: {
                    type: 'Text',
                    validators: ['email']
                },
                test: {
                    type: 'Object',
                    subSchema: {
                        stuff: {
                            type: 'Text',
                            validators: ['required']
                        },
                        more: {
                            type: 'Object',
                            subSchema: {
                                andMore: {
                                    type: 'Text',
                                    validators: ['required']
                                }
                            }
                        }
                    }
                }
            }
        }, errors = {
            'name': [{message: msg1}],
            'test.stuff': [{message: msg2}],
            'test.more.andMore': [{message: msg3}]
        }
        var root = into(<Form value={value} schema={schema} errors={{}}/>);
        root.setErrors(errors);
        /*   expect(root.refs.name.state.errors[0].message).toEqual(msg1);
         var res = root.validate();
         expect(res.name[0].message).toEqual(msg1);
         expect(res['test.stuff'][0].message).toEqual(msg2);
         expect(res['test.more.andMore'][0].message).toEqual(msg3);

         Simulate.change(root.refs.test.refs.field.refs.stuff.refs.field.refs.input, {target: {value: null}})
         var res = root.validate();
         expect(res.name[0].message).toEqual(msg1);
         expect(res['test.stuff'][0].message).toEqual(msg2);
         expect(res['test.more.andMore'][0].message).toEqual(msg3);

         Simulate.change(root.refs.test.refs.field.refs.stuff.refs.field.refs.input, {target: {value: 'stuff'}});
         res = root.validate();
         expect(res['test.stuff']).toNotExist();

         Simulate.change(root.refs.test.refs.field.refs.stuff.refs.field.refs.input, {target: {value: ''}});
         res = root.validate();
         expect(res['test.stuff'][0].message).toEqual('Required');*/

    });

    it('should submit a form', function () {
        var schema = {
            schema: {
                "test": "Text"
            },
            fieldsets: [{
                fields: 'test',
                buttons: ["submit"]
            }]
        }, value = {}, submitArgs, onSubmit = (e, ...args)=> {
            e && e.preventDefault();

            submitArgs = args;
        };

        var root = into(<Form value={value} schema={schema} onSubmit={onSubmit}/>, true);
        var button = byType(root, ButtonTemplate);
        expect(button).toExist('it should have rendered');
        click(button);
        expect(submitArgs).toExist();
    });

    it('should not submit a form with errors', function () {
        var schema = {
            schema: {
                "test": {
                    type: "Text",
                    "validators": ["required"]
                }
            },
            fieldsets: [{
                fields: 'test',
                buttons: ["submit"]
            }]
        }, value, error, count = 0, onSubmit = (e, err, val, ...args)=> {
            e && e.preventDefault();
            value = val;
            error = err;
            count++;
        };

        var root = into(<Form value={{}} schema={schema} onSubmit={onSubmit}/>, true);
        var button = byType(root, ButtonTemplate);
        expect(button).toExist('it should have rendered');
        click(button);
        expect(value).toExist();
        expect(error).toExist();
        expect(error.test).toExist();
        expect(error.test[0].type).toBe('required', 'Should have an error');
        expect(error.test.length).toBe(1);
        click(button);
        expect(value).toExist();
        expect(error).toExist();
        expect(error.test).toExist();
        expect(error.test[0].type).toBe('required', 'Should have an error');
        expect(error.test.length).toBe(1);
        expect(count).toBe(2);
    })

})
