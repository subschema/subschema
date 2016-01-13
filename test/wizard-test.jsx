"use strict";

import {React, into,TestUtils,expect, Simulate}  from 'subschema-test-support';
import {Form} from 'Subschema';
import Sample from 'subschema-test-support/samples/Wizard';

describe('Wizard', function () {
    it('should create a new form with a wizard template', function () {
        var root = into(<Form template="WizardTemplate" schema={Sample.schema}/>);
        expect(root).toExist();
    });
});
