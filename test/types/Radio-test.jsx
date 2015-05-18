var React = require('react/addons');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('expect');
var Simulate = React.addons.TestUtils.Simulate;
var Radio = require('../../src/types/Radio.jsx');
var ValueManager = require('../../src/ValueManager');
describe('Radio', function () {
    this.timeout(30000);
    var Form = require('subschema').Form;

    function into(node, debug) {
        return debug ? React.render(node, document.getElementsByTagName('body')[0]) : TestUtils.renderIntoDocument(node);
    }

    it('should create a radios', function () {
        var  vm = ValueManager({test: 2});

        var root = into(<Radio options={ [{val: 1, label: 'One'}, {val: 2, label: 'Two'}]} path="test" valueManager={vm}/>, false);
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(root, 'input');
        expect(inputs.length).toEqual(2);

        var dm0 = inputs[0].getDOMNode(), dm1 = inputs[1].getDOMNode();
        expect(dm0.checked).toEqual(false);
        expect(dm1.checked).toEqual(true);
        vm.setValue({test: 1});
        expect(dm0.checked).toEqual(true);
        expect(dm1.checked).toEqual(false);
        /*Simulate.click(dm1);
         expect(dm0.checked).toEqual(false);
         expect(dm1.checked).toEqual(true);
         */

    });

});