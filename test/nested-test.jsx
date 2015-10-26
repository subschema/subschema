"use strict";
var React = require('react/addons');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('expect');
var Simulate = React.addons.TestUtils.Simulate;
var Editor = require('../src/Editor');
var ObjectType = require('../src/types/Object.jsx');
var TextInput = require('../src/types/Text.jsx');
var Form = require('subschema').Form;
var ValueManager = require('../src/ValueManager');

function into(node, debug) {
    return debug ? React.render(node, document.getElementsByTagName('body')[0]) : TestUtils.renderIntoDocument(node);
}
describe('validate-nested', function () {

    var schema = {
        schema: {
            nested: {
                "type": "Object",
                "subSchema": {
                    "n1": {
                        validators: "required"
                    },
                    "n2": {
                        validators: "required"
                    },
                    n3: "Text"
                }
            },
            test: {
                fieldClass: 'stuff',
                validators: ["required"]
            }
        }
    }
    it('should not other objects', function () {
        var form = into(<Form schema={schema}/>, true);

        var obj = TestUtils.scryRenderedComponentsWithType(form, ObjectType)[0];
        var [n1,n2,n3] = TestUtils.scryRenderedComponentsWithType(obj, TextInput);
        var test = TestUtils.findRenderedDOMComponentWithClass(form, 'stuff');

        expect(obj).toExist();
        expect(n1).toExist();
        expect(n2).toExist();
        expect(n3).toExist();
        expect(test).toExist();
        Simulate.focus(React.findDOMNode(n1));
        Simulate.blur(React.findDOMNode(n1));
        Simulate.focus(React.findDOMNode(n2));
    });
    it('should not validate nested objects', function () {
        var vm = ValueManager({}, {'nested.n2':[{message:'borked'}]});
        var form = into(<Form schema={schema} valueManager={vm}/>, true);

        var obj = TestUtils.scryRenderedComponentsWithType(form, ObjectType)[0];
        var [n1,n2,n3] = TestUtils.scryRenderedComponentsWithType(obj, TextInput);
        var test = TestUtils.findRenderedDOMComponentWithClass(form, 'stuff');

        expect(obj).toExist();
        expect(n1).toExist();
        expect(n2).toExist();
        expect(n3).toExist();
        expect(test).toExist();
        Simulate.focus(React.findDOMNode(n1));
        Simulate.blur(React.findDOMNode(n1));
        Simulate.focus(React.findDOMNode(n2));
    });
});