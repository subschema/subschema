var React = require('react/addons');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('expect');
var Simulate = React.addons.TestUtils.Simulate;
describe('Checkbox', function () {
    this.timeout(30000);
    var Form = require('subschema').Form;

    function into(node) {
        //return React.render(node, document.getElementsByTagName('body')[0]);
        return TestUtils.renderIntoDocument(node);
    }

    it('should create a form', function () {

        var root = into(<Form schema={{schema:{
            c1:'Checkbox',
            c2:{
                type:'Checkbox'
            }
        }}} />);
        expect(root).toExist();
        var ret = root.getValue();
        expect(ret.c1).toNotExist();
        expect(ret.c2).toNotExist();

    });
});