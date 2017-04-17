"use strict";
import React, {Component} from "react";
import {into} from 'subschema-test-support';
import Form from 'Subschema';

describe("FieldSet", function () {


    it('should transition with key', function () {
        const schema1 = {
            schema: {
                test: "Text"
            },
            fieldsets: [{
                transitionKey: 'first',
                transition: 'rollUp',
                fields: 'test'
            }]
        }, schema2 = {
            schema: {
                test2: "Text"
            },
            fieldsets: [{
                transitionKey: 'second',
                transition: 'rollUp',
                fields: 'test2'
            }]
        };

    });
});