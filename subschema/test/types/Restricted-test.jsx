"use strict";
import React from 'react';
import ReactDOM from 'react-dom';

import { into, byType,byTag, intoWithState, TestUtils,expect, Simulate, change} from 'subschema-test-support';
import {Form, types, ValueManager} from 'Subschema';

const {Restricted} = types;


describe('types/Restricted', function () {
    this.timeout(50000);

    it('should create a restricted input', function () {
        var onChange = (value)=> {
            state.setState({value})
        }, {state, child} = intoWithState(<Restricted formatter="###-##" onChange={onChange}/>, {}, true);
        expect(child).toExist();

    });
    it('should work within a Form', function () {
        var valueManager = ValueManager();
        var schema = {
            schema: {
                'test': {
                    type: 'Restricted',
                    formatter: '###-##'
                }
            }
        };
        var form = into(<Form valueManager={valueManager} schema={schema}/>)
        var restricted = byType(form, Restricted);
        expect(restricted).toExist('should render restricted');
        var input = byTag(restricted, 'input');
        change(input, '1');
        expect(valueManager.path('test')).toBe('1', 'should update value manager');
        change(input, '123');
        expect(valueManager.path('test')).toBe('123-', 'should update value manager');
        change(input, '123-4');
        expect(valueManager.path('test')).toBe('123-4', 'should update value manager');
    })
    describe('mm20YY', function () {
        var onChange, input, inputEl, state, child;

        before(function () {
            onChange = function (value) {
                state.setState({value})
            };
            ({state, child} = intoWithState(<Restricted formatter="mm20YY" onChange={onChange}/>, {}));



            expect(child).toExist();

            input = TestUtils.scryRenderedDOMComponentsWithTag(child, 'input')[0];

            inputEl = ReactDOM.findDOMNode(input);

        });

        it('enters 2/16', function () {
            change(input, '2');
            expect(inputEl.value).toBe('02/');

            change(input, '02/1');
            expect(inputEl.value).toBe('02/201');

            change(input, '02/2016');
            expect(inputEl.value).toBe('02/16');
        });

        it('enters 1/16', function () {
            change(input, '1');
            expect(inputEl.value).toBe('1');

            change(input, '1/');
            expect(inputEl.value).toBe('01/');
        });
        it('enters 1/1', function () {
            change(input, '1/1');
            expect(inputEl.value).toBe('01/201');

            change(input, '01/16');
            expect(inputEl.value).toBe('01/16');
        });

        it('enters 01/2016', function () {
            change(input, '0');
            expect(inputEl.value).toBe('0');

            change(input, '01');
            expect(inputEl.value).toBe('01/');

            change(input, '01/2');
            expect(inputEl.value).toBe('01/2');

            change(input, '01/20');
            expect(inputEl.value).toBe('01/20');

            change(input, '01/201');
            expect(inputEl.value).toBe('01/201');

            change(input, '01/2016');
            expect(inputEl.value).toBe('01/16');

        });
        it('enters 13', function () {

            change(input, '13');
            expect(inputEl.value).toBe('01/203');

        });
        it('enters 133', function () {

            change(input, '133');
            expect(inputEl.value).toBe('01/33');

        });
    });
});