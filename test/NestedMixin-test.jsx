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

var NestedMixin = require('../src/NestedMixin');

function into(node, debug) {
    return debug ? React.render(node, document.getElementsByTagName('body')[0]) : TestUtils.renderIntoDocument(node);
}
describe('NestedMixin', function () {

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
        var vm = ValueManager({}, {'nested.n2': [{message: 'borked'}]});
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

    describe('should normailize fields and fieldsets', function () {
        it('should normilize fieldsets', function () {
            var inFieldsets = [{
                fields: ['a', 'b', 'c']
            }, {
                fields: ['d', 'e', 'f']
            }];
            var {fields}  = NestedMixin.normalizeFieldsets(inFieldsets, []);
            expect(fields).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        });
        it('should normilize string fieldsets', function () {
            var inFieldsets = [{
                fields: 'a, b, c'
            }, 'd, e, f'
            ];
            var {fieldsets, fields}  = NestedMixin.normalizeFieldsets(inFieldsets, []);
            expect(fields).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
            expect(fieldsets[0].fields).toEqual(['a', 'b', 'c']);
            expect(fieldsets[1].fields).toEqual(['d', 'e', 'f']);
            console.log(JSON.stringify(fieldsets));
        });

        it.only('should normalize nested fieldsets', function () {
            var inFieldsets = [{
                fieldsets: [
                    {fields: 'a'},
                    {fields: 'b'},
                    {fields: 'c'}]
            }, 'd, e, f'
            ];
            var {fieldsets, fields}  = NestedMixin.normalizeFieldsets(inFieldsets, []);
            expect(fields).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
            console.log(JSON.stringify(fieldsets, null, 3));
            expect(fieldsets[0].fieldsets[0].fields).toEqual(['a']);
            expect(fieldsets[0].fieldsets[1].fields).toEqual(['b']);
            expect(fieldsets[0].fieldsets[2].fields).toEqual(['c']);
           // expect(fieldsets[1].fields).toEqual(['d', 'e', 'f']);
        });
    });
});