var React = require('react/addons');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('expect');
var Simulate = React.addons.TestUtils.Simulate;
var Restricted = require('../../src/types/Restricted.jsx');
describe('Checkbox', function () {
    this.timeout(30000);
    var Form = require('subschema').Form;

    function into(node) {
        //return React.render(node, document.getElementsByTagName('body')[0]);
        return TestUtils.renderIntoDocument(node);
    }

    it('should create a restricted input', function () {

        var root = into(<Restricted formatter="###-##" />);
        expect(root).toExist();

    });
});