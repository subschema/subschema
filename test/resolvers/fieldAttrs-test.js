"use strict";
import React, {Component} from "react";
import {Subschema, Form, loaderFactory, DefaultLoader, PropTypes, ValueManager, resolver} from "Subschema";
import {expect, byTag, into} from "subschema-test-support";


describe("resolvers/fieldAttrs", function () {


    it('should insert fieldAttrs', function () {
        const schema = {
            test: {
                "type": "Text",
                "fieldAttrs": {
                    "data-stuff": 1,
                    "aria-role": "content"
                }
            }
        };
        const form = into(<Form schema={{
            schema
        }}/>);
        const input = byTag(form, 'input');
        expect(input.dataset.stuff).toBe('1');
        expect(input.attributes['aria-role'].value).toBe('content');
    });
});