import {intoWithContext, findNode, byTags, React, TestUtils,expect, Simulate} from '../support';
import {types, ValueManager, loader} from 'subschema';

var Radio = types.Radio;

describe('Radio', function () {

    it('should create a radios', function () {
        var vm = ValueManager({test: 2});

        var root = intoWithContext(<Radio options={ [{val: 1, label: 'One'}, {val: 2, label: 'Two'}]}
                                          path="test"/>, {valueManager: vm, loader});

        var inputs = byTags(root, 'input');
        expect(inputs.length).toEqual(2);

        var dm0 = findNode(inputs[0]), dm1 = findNode(inputs[1]);
        expect(dm0.checked).toEqual(false);
        expect(dm1.checked).toEqual(true);
        vm.setValue({test: 1});
        expect(dm0.checked).toEqual(true);
        expect(dm1.checked).toEqual(false);
        /*Simulate.click(dm1);
         expect(dm0.checked).toEqual(false);
         expect(dm1.checked).toEqual(true);
         */

    });

});