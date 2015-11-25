import {intoWithState, findNode, byTags, React, TestUtils,expect, Simulate} from '../support';
import {types, ValueManager, loader} from 'Subschema';

var Radio = types.Radio;

describe('Radio', function () {

    it('should create a radios', function () {

        var {state, child} = intoWithState(<Radio
            options={ [{val: 1, label: 'One'}, {val: 2, label: 'Two'}]}
        />, {value: 2});

        var inputs = byTags(child, 'input');
        expect(inputs.length).toEqual(2);

        var dm0 = findNode(inputs[0]), dm1 = findNode(inputs[1]);
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