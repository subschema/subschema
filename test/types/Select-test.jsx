import {React, findNode, into, TestUtils,expect, Simulate,select, byTags} from '../support';
import {types, ValueManager} from 'Subschema';
var Select = types.Select;

describe.only('Select', function () {
    this.timeout(50000);
    var values = [];
    var onChange = function (e) {
        values.push(e);
    }
    beforeEach(function () {
        values.length = 0;
    });

    it('should create a select', function () {
        var sel = into(<Select options={[{val: 1, label: 'One'}, {val: 2, label: 'Two'}]} path="test"
                               onChange={onChange}/>);
        expect(sel).toExist();
        expect(values.length).toBe(0);
        var options = byTags(sel, 'option');
        expect(options.length).toBe(2, 'should have to options');
        expect(options[0].value).toBe('1');
        expect(options[1].value).toBe('2');
        select(sel, 1);
        expect(values.length).toBe(1);
        expect(values[0]).toBe('2');

    });

    it('should create a multi select', function () {
        var sel = into(<Select multiple={true} options={[{val: 1, label: 'One'}, {val: 2, label: 'Two'}]}
                               path="test" onChange={onChange}/>);

        expect(sel).toExist();
        expect(values.length).toBe(0);
        var options = byTags(sel, 'option');
        expect(options.length).toBe(2, 'should have to options');
        expect(options[0].value).toBe('1');
        expect(options[1].value).toBe('2');
        select(sel, 1);
        expect(values.length).toBe(1);
        expect(values[0][0]).toBe('2');

        select(sel, 0);
        expect(values.length).toBe(2);
        expect(values[0][0]).toBe('2');
        expect(values[1][0]).toBe('1');

    });
});