var React = require('react/addons');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('expect');
var Wizard = require('../src/templates/WizardTemplate.jsx');
var ValueManager = require('../src/ValueManager');
var Sample = require('../public/samples/Wizard');
var Form = require('subschema').Form;
var Simulate = React.addons.TestUtils.Simulate;
describe('Wizard', function () {
    this.timeout(30000);

    function into(node, debug) {
        return debug ? React.render(node, document.getElementsByTagName('body')[0]) :
            TestUtils.renderIntoDocument(node);
    }

    it('should create a new wizard', function () {
        var vm = ValueManager();
        var root = into(<Wizard schema={Sample.schema} valueManager={vm}/>);
        expect(root).toExist();
    });
    it('should create a new form with a wizard template', function () {
        var root = into(<Form template="WizardTemplate" schema={Sample.schema}/>);
        expect(root).toExist();
    });
})
