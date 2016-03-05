"use strict";
import React from 'react';
import {intoWithState, findNode, byTags, TestUtils,expect, Simulate} from 'subschema-test-support';
import {types, ValueManager, loader, templates} from 'Subschema';

const {Radio} = types;

describe('types/Radio', function () {

    it('should create a radios', function () {

        const {state, child} = intoWithState(<Radio
            itemTemplate={templates.RadioItemTemplate}
            onChange={(e)=>e}
            options={ [{val: 1, label: 'One'}, {val: 2, label: 'Two'}]}
        />, {value: 2}, true);

        const inputs = byTags(child, 'input');
        expect(inputs.length).toEqual(2);

        const dm0 = findNode(inputs[0]), dm1 = findNode(inputs[1]);
        expect(dm0.checked).toEqual(false);
        /*     expect(dm1.checked).toEqual(true);
         state.setState({value: 1});
         expect(dm0.checked).toEqual(true);
         expect(dm1.checked).toEqual(false);*/
        /*Simulate.click(dm1);
         expect(dm0.checked).toEqual(false);
         expect(dm1.checked).toEqual(true);
         */

    });

});