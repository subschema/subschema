var {React, into,TestUtils,expect, Simulate} = require('./support');

var Wizard = require('../src/templates/WizardTemplate.jsx');
var ValueManager = require('../src/ValueManager');
var Sample = require('../public/samples/Wizard');
var Form = require('subschema').Form;

describe('Wizard', function () {
    this.timeout(30000);

    it('should create a new form with a wizard template', function () {
        var root = into(<Form template="WizardTemplate" schema={Sample.schema}/>);
        expect(root).toExist();
    });
})
