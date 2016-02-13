"use strict";

import {intoWithState, findNode, byTags, React, TestUtils,expect, Simulate} from 'subschema-test-support';
import {types, ValueManager, loader} from 'Subschema';

const Radio = types.Radio;

describe('types/Radio', function () {

    it('should create a radios', function () {

        const {state, child} = intoWithState(<Radio
            options={ [{val: 1, label: 'One'}, {val: 2, label: 'Two'}]}
        />, {value: 2});

        const inputs = byTags(child, 'input');
        expect(inputs.length).toEqual(2);

        const dm0 = findNode(inputs[0]), dm1 = findNode(inputs[1]);
        expect(dm0.checked).toEqual(false);
        expect(dm1.checked).toEqual(true);
        state.setState({value: 1});
        expect(dm0.checked).toEqual(true);
        expect(dm1.checked).toEqual(false);
        /*Simulate.click(dm1);
         expect(dm0.checked).toEqual(false);
         expect(dm1.checked).toEqual(true);
         */

    });

});