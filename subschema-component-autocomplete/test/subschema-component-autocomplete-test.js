import React from 'react';
import {
    intoWithState,
    change,
    click,
    byTypes,
    byTag,
    expect
} from 'subschema-test-support';
import SubschemaCssBootstrap from 'subschema-css-bootstrap';
import {Autocomplete, AutocompleteItemTemplate, styles, templates, types} from 'subschema-component-autocomplete';
import {OptionsProcessor} from 'subschema-processors';
import {types as formTypes} from 'subschema-component-form';
function noop() {

}
describe('subschema-component-autocomplete', function () {
    this.timeout(50000);
    var options = [
        {label: 'ABC', val: 'abc'},
        {label: 'DBC', val: 'dbc'},
        {label: 'JDK', val: 'jdk'}
    ];

    it('should render an autocomplete and select suggested', function () {

        var {child, state} = intoWithState(<Autocomplete inputType={formTypes.Text}
                                                         itemTemplate={AutocompleteItemTemplate}
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
                                                         inputType={formTypes.Text}
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