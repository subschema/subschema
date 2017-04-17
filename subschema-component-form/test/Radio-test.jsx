"use strict";
import React from "react";
import {intoWithState, findNode, byTags, expect} from "subschema-test-support";
import {types, ValueManager, loader, templates} from "Subschema";
import {renderToStaticMarkup} from "react-dom/server";

const {Radio} = types;

describe('types/Radio', function () {


    it('should create a radios and test output', function () {

        const result = renderToStaticMarkup(<Radio
            itemTemplate={templates.RadioItemTemplate}
            path="test"
            options={ [{val: 1, label: 'One'}, {val: 2, label: 'Two'}]}
        />);
        expect(result).toBe(
            '<div><div class="radio "><label class="" for="test.0"><input type="radio" id="test.0" name="test" value="1"/><span>One</span></label></div><div class="radio "><label class="" for="test.1"><input type="radio" id="test.1" name="test" value="2"/><span>Two</span></label></div></div>'
        );
    });

    it('should create a radios and test output checked', function () {

        const result = renderToStaticMarkup(<Radio
            itemTemplate={templates.RadioItemTemplate}
            path="test"
            value={1}
            options={ [{val: 1, label: 'One'}, {val: 2, label: 'Two'}]}
        />);
        expect(result).toBe(
            '<div><div class="radio "><label class="" for="test.0"><input type="radio" id="test.0" name="test" checked="" value="1"/><span>One</span></label></div><div class="radio "><label class="" for="test.1"><input type="radio" id="test.1" name="test" value="2"/><span>Two</span></label></div></div>'
        );
    });

    it('should create a radios', function () {
        let state, child;

        function handleState(value) {
            state.setState({value});
        }

        ({state, child} = intoWithState(<Radio
            itemTemplate={templates.RadioItemTemplate}
            onChange={handleState}
            name="stuff"
            options={ [{val: 1, label: 'One'}, {val: 2, label: 'Two'}]}
        />, {value: 2}, true));

        const inputs = byTags(child, 'input');
        expect(inputs.length).toEqual(2);

        const dm0 = findNode(inputs[0]), dm1 = findNode(inputs[1]);
        expect(dm0.checked).toEqual(false);
        expect(dm1.checked).toEqual(true);
        state.setState({value: 1});
        expect(dm0.checked).toEqual(true);
        expect(dm1.checked).toEqual(false);


    });

});