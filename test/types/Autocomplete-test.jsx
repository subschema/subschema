"use strict";

import {React, check, intoWithState, change, into, byType, click, byTypes, byTag, findNode,expect} from 'subschema-test-support';
import {Form, ValueManager, processors, templates, types} from 'Subschema';
const {Autocomplete} = types;
const {OptionsProcessor} = processors;
const {AutocompleteItemTemplate} = templates;

function noop() {

}
describe('types/Autocomplete', function () {
    this.timeout(50000);
    var options = [
        {label: 'ABC', val: 'abc'},
        {label: 'DBC', val: 'dbc'},
        {label: 'JDK', val: 'jdk'}
    ];

    it('should render an autocomplete and select suggested', function () {
        var {child, state} = intoWithState(<Autocomplete inputType={types.Text} itemTemplate={AutocompleteItemTemplate}
                                                         options={options} processor={OptionsProcessor}
                                                         onInputChange={noop} onChange={noop} onSelect={noop}/>, {});
        expect(child).toExist('should render autocomplete');
        var input = byTag(child, 'input');
        expect(input).toExist('should show input');
        change(input, 'b');
        var suggest = byTypes(child, AutocompleteItemTemplate);
        expect(suggest.length).toBe(2, 'should suggest two');

        change(input, 'db');
        suggest = byTypes(child, AutocompleteItemTemplate);
        click(suggest[0]);
        var input = byTag(child, 'input');
        expect(input.value).toBe('DBC');
    });

    it('should render an autocomplete  with a value and autoSelectSingle set to true', function () {
        var {child, state} = intoWithState(<Autocomplete itemTemplate={AutocompleteItemTemplate}
                                                         inputType={types.Text}
                                                         value="abc"
                                                         autoSelectSingle={true}
                                                         options={options} processor={OptionsProcessor}
                                                         onInputChange={noop} onChange={noop} onSelect={noop}/>, {});
        expect(child).toExist('should render autocomplete');
        var input = byTag(child, 'input');
        expect(input).toExist('should show input');
        expect(input.value).toBe('abc');
        change(input, 'j')
        expect(input.value).toBe('JDK');
    });
});