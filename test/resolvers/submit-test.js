"use strict";
import React, {Component} from "react";
import {Subschema, Form, loaderFactory, DefaultLoader, PropTypes, ValueManager, resolver} from "Subschema";
import {into, Simulate, byTag, byComponent} from "subschema-test-support";

import expect from 'expect';

class TestForm extends Component {
    static propTypes = {
        onSubmit: PropTypes.submit
    };

    render() {
        const {children, ...props} = this.props;
        return <form {...props}>
            <h1>What</h1>
            {children}
        </form>
    }
}

describe("resolvers/submit", function () {
    this.timeout(5000);
    it('should submit ', function (done) {
        const loader = loaderFactory([DefaultLoader]);
        loader.addTemplate({TestForm});
        const valueManager = ValueManager();
        valueManager.addSubmitListener(null, (e, err, value, path)=> {
            e && e.preventDefault();
            expect(Object.keys(value).length).toBe(0);
            expect(err['hello']).toExist();
            expect(err['deep.test']).toExist();
            done();
        });
        const schema = {
            schema: {
                "hello": {
                    "type": "Text",
                    "validators": ["required"]
                },
                "deep": {
                    "type": "Object",
                    "template": "TestForm",
                    "subSchema": {
                        "schema": {
                            "test": {
                                "type": "Text",
                                "validators": ["required"]
                            }
                        },
                        "fieldsets": [{
                            "fields": "test",
                            buttons: ["submit"]
                        }]
                    }
                }
            }
        };
        const form = into(<Form template="ObjectTemplate" loader={loader} schema={schema}
                                valueManager={valueManager}/>, true);
        const f = byTag(form, "form");
        Simulate.submit(f);
        //  f.submit();

    });
});