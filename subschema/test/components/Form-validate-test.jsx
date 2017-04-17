"use strict";
import React from "react";
import {Form} from "Subschema";
import expect from "expect";
import {renderToString, renderToStaticMarkup} from "react-dom/server";

describe('components/Form/validate', function () {
    it('should validate a form on init isomorphically', function () {
        this.timeout(50000);
        const schema = {
            test: {
                type: 'Text',
                validators: ['required']

            }
        };
        const content = renderToString(<Form schema={{schema}} value={{}} validate={true}/>);
        expect(content).toMatch(/Required/);
    });

    it('should not validate a form on init isomorphically', function () {
        this.timeout(50000);
        const schema = {
            test: {
                type: 'Text',
                validators: ['required']

            }
        };
        const content = renderToString(<Form schema={{schema}} value={{}}/>);
        expect(content).toNotMatch(/Required/);
    });

    it('should not validate a form on init isomorphically but passed an error', function () {
        this.timeout(50000);
        const schema = {
            test: {
                type: 'Text',
                validators: ['required']

            }
        };
        const content = renderToString(<Form schema={{schema}} value={{}} errors={{test:[{message:'Super'}]}}
                                             validate={true}/>);
        expect(content).toNotMatch(/Required/);
        expect(content).toMatch(/Super/);
    });

    it('should not validate a form on init isomorphically but passed an error without validate', function () {
        this.timeout(50000);
        const schema = {
            test: {
                type: 'Text',
                validators: ['required']

            }
        };
        const content = renderToString(<Form schema={{schema}} value={{}} errors={{test:[{message:'Super'}]}}/>);
        expect(content).toNotMatch(/Required/);
        expect(content).toMatch(/Super/);
    });


});