import {React, ReactDOM, into,TestUtils,expect, Simulate, change} from '../support';
import {types} from 'subschema';

var Restricted = types.Restricted;


describe('Restricted', function () {
    this.timeout(30000);
    var Form = require('subschema').Form;

    it('should create a restricted input', function () {

        var root = into(<Restricted formatter="###-##"/>);
        expect(root).toExist();

    });

    describe('mm20YY', function () {
        var root = into(<Restricted formatter="mm20YY"/>);
        expect(root).toExist();
        var input = TestUtils.scryRenderedDOMComponentsWithTag(root, 'input')[0];
        var inputEl = ReactDOM.findDOMNode(input);

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