import {React, into,TestUtils,expect, Simulate}  from './support';
import {Form} from 'Subschema';
import Sample from '../public/samples/Wizard';

describe('Wizard', function () {
    it('should create a new form with a wizard template', function () {
        var root = into(<Form template="WizardTemplate" schema={Sample.schema}/>);
        expect(root).toExist();
    });
});
