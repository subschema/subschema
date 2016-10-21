import {React, into,TestUtils,expect,byTypes, click, select, byTag, byType, change, byComponents,Simulate}  from 'subschema-test-support';
import  {ValueManager, types,  templates, newSubschemaContext} from 'Subschema';
import AutoComplete from 'subschema-test-support-samples/Autocomplete.js';
import AutoCompleteSetup from 'subschema-test-support-samples/Autocomplete-setup.js';
describe('public/AutoComplete', function () {
    this.timeout(50000);
    it('should not be selectable', function () {
        const Subschema = newSubschemaContext();
        const {Form,  loader} = Subschema;
        const schema = AutoComplete.schema;
        const valueManager = ValueManager();
        AutoCompleteSetup(loader, schema, Subschema, React, valueManager);

        const form = into(<Form schema={schema} loader={loader} valueManager={valueManager}/>, true);
        expect(form);

        const [simple, ajax] = byTypes(form, types.Autocomplete, 2);

        change(byTag(simple, 'input'), 'aaa');

        const suggestions = byComponents(simple, templates.AutocompleteItemTemplate, 4);

        click(suggestions[2]);

    });
    it('should render and not leak', function(){
        const Subschema = newSubschemaContext();
        const {Form, ValueManager, loader, injector} = Subschema;

        const schema = AutoComplete.schema;
        const valueManager = ValueManager();
        AutoCompleteSetup(loader, schema, Subschema, React, valueManager);


        class RenderTest extends React.Component {
            state = {count:1};
            increment(){
                this.setState({count:this.state.count+1});
            }
            render(){
                const {count} = this.state;
                const {...copy} = schema;
               return  count % 3 ?  <Form key={`render-count-${count}`} schema={copy} loader={loader} valueManager={valueManager}/> : null;
            }
        };


        const form = into(<RenderTest/>, true);
        expect(form);
        if (valueManager.listeners)
            expect(valueManager.listeners.length).toBe(4);
        expect(injector.size()).toBe(12);
        form.increment();
        form.increment();
        if (valueManager.listeners)
            expect(valueManager.listeners.length).toBe(0);
        expect(injector.size()).toBe(12);
        form.increment();
        form.increment();
        form.increment();
        form.increment();
        form.increment();
        if (valueManager.listeners)
            expect(valueManager.listeners.length).toBe(4);
        expect(injector.size()).toBe(12);

        //just a simple test to make sure everything still works.
        const [simple, ajax] = byTypes(form, types.Autocomplete, 2);

        change(byTag(simple, 'input'), 'aaa');

        const suggestions = byComponents(simple, templates.AutocompleteItemTemplate, 4);

        click(suggestions[2]);


    });

});