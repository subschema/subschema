import {React, into,TestUtils,expect,byTypes, click, select, byTag, byType, change, byComponents,Simulate}  from 'subschema-test-support';
import Subschema, {Form, types, ValueManager, templates, loaderFactory, DefaultLoader} from 'Subschema';
import AutoComplete from 'subschema-test-support/samples/AutoComplete.js';
import AutoCompleteSetup from 'subschema-test-support/samples/AutoComplete-setup.js';
describe('public/AutoComplete', function () {
    this.timeout(50000);
    it('should not be selectable', function () {
        const schema = AutoComplete.schema;
        const loader = loaderFactory([DefaultLoader]);
        const valueManager = ValueManager();
        AutoCompleteSetup(loader, schema, Subschema, React, valueManager);

        const form = into(<Form schema={schema} loader={loader} valueManager={valueManager}/>, true);
        expect(form);

        const [simple, ajax] = byTypes(form, types.Autocomplete, 2);

        change(byTag(simple, 'input'), 'aaa');

        const suggestions = byComponents(simple, templates.AutocompleteItemTemplate, 4);

        click(suggestions[2]);

    })
});