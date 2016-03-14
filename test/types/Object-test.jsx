"use strict";

import {React, into, intoWithContext, TestUtils,expect, findNode, Simulate} from 'subschema-test-support';
import {ValueManager,loaderFactory, Form, types} from 'Subschema';

const ObjectType = types.Object
const TextInput = types.Text;

describe('types/Object', function () {

    const schema = {
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
            test: Object.freeze( {
                fieldClass: 'stuff',
                validators: ["required"]
            })
        }
    };

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

});