import React, {Component} from "react";
import loaderFactory from 'subschema-loader';
import ValueManager from 'subschema-valueManager';
import PropTypes from 'subschema-prop-types';
import Form from 'subschema-core/lib/Form';
import ObjectType from 'subschema-core/lib/Object';
import {types, templates} from 'subschema-component-form';
import {into, Simulate, byTag, byComponent} from "subschema-test-support";
import newSubschemaContext from 'subschema-test-support/lib/newSubschemaContext';

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
    it('should submit ', function (done) {
        const {Form, context, loader, valueManager} = newSubschemaContext();
        valueManager.addSubmitListener(null, (e, err, value, path) => {
            e && e.preventDefault();
            expect(Object.keys(value).length).toBe(0);
            expect(err['hello']).toExist();
            expect(err['deep.test']).toExist();
            done();
        });
        loader.addTemplate({TestForm});

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
        const form = into(<Form template="ObjectTemplate" {...context} schema={schema}
                                valueManager={valueManager}/>, true);
        const f = byTag(form, "form");
        Simulate.submit(f);
        //  f.submit();

    });
});
