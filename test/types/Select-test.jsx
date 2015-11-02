var {React, findNode, into, intoWithContext, TestUtils,expect, Simulate} = require('../support');

var Select = require('../../src/types/Select.jsx');
var ValueManager = require('../../src/ValueManager');

describe('Select', function () {
    this.timeout(30000);

    it('should create a select', function () {
        var vm = ValueManager({test: 2});

        var root = intoWithContext(<Select options={[{val: 1, label: 'One'}, {val: 2, label: 'Two'}]} path="test"
            />, {valueManager: vm});
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(root, 'select');
        expect(inputs.length).toEqual(1);
        var select = inputs[0];
        expect(findNode(select).value).toEqual(2);
        vm.setValue({test: 1});
        expect(findNode(select).value).toEqual(1);
        expect(vm.path('test')).toEqual(1);
        var fired = 0;
        var listen = function (value) {
            fired++;
            expect(value).toBe(2);
        };
        vm.addListener('test', listen);
        vm.setValue({test: 2});
        vm.removeListener(listen);
        vm.setValue({test: 1});
        expect(fired).toBe(1);
    });
    it('should create a multi select', function () {
        var vm = ValueManager({test: [2, 1]});

        var root = intoWithContext(<Select multiple={true} options={[{val: 1, label: 'One'}, {val: 2, label: 'Two'}]} path="test"/>, {valueManager:vm});
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(root, 'select');
        expect(inputs.length).toEqual(1);
        var select = inputs[0];
        vm.setValue({test: [1]});
        expect(vm.path('test')).toEqual([1]);
        var fired = 0;
        var listen = function (value) {
            fired++;
            expect(value).toEqual([2]);
        };
        vm.addListener('test', listen);
        vm.setValue({test: [2]});
        vm.removeListener(listen);
        vm.setValue({test: [1]});
        expect(fired).toBe(1);
    });
});