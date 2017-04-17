"use strict";
import React from 'react';
import { findNode, into, expect, change} from 'subschema-test-support';
import {types} from 'Subschema';

const {Text} = types;

describe('types/Text', function () {
    it('should create a input with a value', function () {
        var text = into(<Text value="abc" onChange={(e)=>e}/>);
        expect(text).toExist();
        var node = findNode(text);
        expect(node.value).toBe('abc');

    });
    it('should trigger on change when changed', function () {
        var args = [], onChange = (e)=> {
            args.push(e.target.value)
        };
        var text = into(<Text className="stuff" value="abc" onChange={onChange}/>);
        expect(text).toExist();
        var node = findNode(text);
        expect(node.value).toBe('abc');
        change(node, 'def');
        expect(args[0]).toBe('def');
        expect(node.className).toBe('stuff');
        expect(node.value).toBe('abc');
        var attrs = toAttr(node);
        expect(Object.keys(attrs).length).toBe(4);
        expect(attrs.class).toBe('stuff');
        expect(attrs.type).toBe('text');

    });

    function toAttr(node) {
        var attributes = findNode(node).attributes;
        var obj = {};

        for (var i = 0, len = attributes.length; i < len; i++) {
            obj[attributes[i].name] = attributes[i].value;
        }
        return obj;
    }
});