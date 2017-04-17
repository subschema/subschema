"use strict";
import React from "react";
import {into, byTag, expect, select, byTags} from "subschema-test-support";
import {Form, types, ValueManager} from "Subschema";

const {Select} = types;

describe('types/Select', function () {
    this.timeout(50000);
    var values = [];
    var onChange = function (e) {
        values.push(e);
    };

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

    it('should have the value selected with numbers', function () {
        const vm = ValueManager({select: 2});
        const form = into(<Form schema={{schema:{select:{type:'Select', options:[1,2,3]}}}} valueManager={vm}/>, true);

        expect(form).toExist();
        expect(values.length).toBe(0);
        const sel = byTag(form, 'select');

        const options = byTags(form, 'option');

        expect(options.length).toBe(3, 'should have to options');
        expect(options[0].value).toBe('1');
        expect(options[1].value).toBe('2');
        expect(options[2].value).toBe('3');
        expect(sel.value).toBe('2');

        vm.update('select', 3);
        expect(sel.value).toBe('3');
    });


    it('should have the value selected with validators', function () {
        const vm = ValueManager({select: 2});

        function noThree(v) {
            return v == 3 ? {message: 'No threes for you'} : null
        }

        const form = into(<Form
            validate={true}
            schema={{schema:{select:{type:'Select',validators:[noThree], options:[1,2,3]}}}}
            valueManager={vm}/>, true);

        expect(form).toExist();
        expect(values.length).toBe(0);
        const sel = byTag(form, 'select');

        const options = byTags(form, 'option');

        expect(options.length).toBe(3, 'should have to options');
        expect(options[0].value).toBe('1');
        expect(options[1].value).toBe('2');
        expect(options[2].value).toBe('3');
        expect(sel.value).toBe('2');

        vm.update('select', 3);
        expect(sel.value).toBe('3');
        expect(vm.errorsFor('select')[0].message).toBe('No threes for you');
        vm.update('select', 2);
        expect(vm.errorsFor('select')).toNotExist();
    });

});