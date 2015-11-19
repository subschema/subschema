import {React, into,intoWithContext, findNode, TestUtils,expect, Simulate} from '../support';
import {Form, ValueManager, types} from 'Subschema';
var Text = types.Text;
describe('Text', function () {
    it('should create a input with a value', function () {
        var valueManager = ValueManager({test: 'abc'})
        var text = intoWithContext(<Text path="test"/>, {valueManager});
        expect(text).toExist();
        var node = findNode(text);
        expect(node.value).toBe('abc');

    });
    it('should change a input with a value', function () {
        var valueManager = ValueManager()
        var text = intoWithContext(<Text path="test"/>, {valueManager});
        expect(text).toExist();
        var node = findNode(text);
        expect(node.value).toBe('');

        valueManager.update('test', 'abc');
        node = findNode(text);

        expect(node.value).toBe('abc');

    });
});