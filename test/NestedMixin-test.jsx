"use strict";
var {React, into,TestUtils,expect, findNode, Simulate} = require('./support');

var Editor = require('../src/Editor');
var ObjectType = require('../src/types/Object.jsx');
var TextInput = require('../src/types/Text.jsx');
var ValueManager = require('../src/ValueManager');
var loaderFactory = require('../src/loaderFactory');
var NestedMixin = require('../src/NestedMixin');
var Form = require('subschema').Form;


function into(node, debug) {
    return debug ? ReactDOM.render(node, document.getElementsByTagName('body')[0]) : TestUtils.renderIntoDocument(node);
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
        Simulate.focus(findNode(n1));
        Simulate.blur(findNode(n1));
        Simulate.focus(findNode(n2));
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
        Simulate.focus(findNode(n1));
        Simulate.blur(findNode(n1));
        Simulate.focus(findNode(n2));
    });
    describe('normalizeSchema', function () {
        var loader = loaderFactory();
        loader.addSchema({
            Address: {
                schema: {
                    address: 'Text',
                    city: 'Text',
                    state: {
                        type: 'Select',
                        options: ['CA', 'FL', 'VA', 'IL']
                    },
                    zipCode: {
                        type: 'Text',
                        dataType: 'number'
                    }
                },
                fields: ['address', 'city', 'state', 'zipCode']
            },
            Contact: {
                schema: {
                    name: 'Text',
                    primary: {
                        type: 'ToggleObject',
                        subSchema: 'Address',
                        template: 'SimpleTemplate'
                    },
                    otherAddresses: {
                        canEdit: true,
                        canReorder: true,
                        canDelete: true,
                        canAdd: true,
                        type: 'List',
                        labelKey: 'address',
                        itemType: {
                            type: 'Object',
                            subSchema: 'Address'
                        }
                    }
                },
                fields: ['name', 'primary', 'otherAddresses']
            }
        });

        it('should normalize with subSchema with loaders', function () {

            var result = NestedMixin.normalizeSchema({subSchema: 'Contact'}, loader);
            expect(result.fields, 'name', 'primary', 'otherAddresss');
        });

    });

    describe('should normalize fields and fieldsets', function () {
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

        it('should normalize nested fieldsets', function () {
            var inFieldsets = [{
                fieldsets: [
                    {fields: 'a'},
                    {fields: 'b'},
                    {fields: 'c'}]
            }, 'd, e, f'
            ];
            var {fieldsets, fields}  = NestedMixin.normalizeFieldsets(inFieldsets, []);
            expect(fields).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
            expect(fieldsets[0].fieldsets[0].fields).toEqual(['a']);
            expect(fieldsets[0].fieldsets[1].fields).toEqual(['b']);
            expect(fieldsets[0].fieldsets[2].fields).toEqual(['c']);
        });
        it('should normalize nested fieldsets with fieldsets', function () {
            var inFieldsets = [{
                fieldsets: [
                    {fieldsets: [{fields: 'a'}]},
                    {fieldsets: [{fields: 'b'}]},
                    {fields: 'c'}]
            }, 'd, e, f'
            ];
            var {fieldsets, fields}  = NestedMixin.normalizeFieldsets(inFieldsets, []);
            expect(fields).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
            expect(fieldsets[0].fieldsets[0].fieldsets[0].fields).toEqual(['a']);
            expect(fieldsets[0].fieldsets[1].fieldsets[0].fields).toEqual(['b']);
        });
    });
});