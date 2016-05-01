"use strict";
import React from "react";
import {findNode, into, expect} from "subschema-test-support";
import {types} from "Subschema";

const {Date} = types;

describe('types/Date', function () {
    it('should create a input with a value', function () {
        var text = into(<Date value="01/02/2015" onChange={(e)=>e}/>);
        expect(text).toExist();
        var node = findNode(text);
        expect(node.value).toBe('2015-01-02');

    });
});