import React from 'react';
import {into}  from 'subschema-test-support';
import {newSubschemaContext} from 'subschema';

describe("subschema-test-samples/MoreInfo", function () {
    this.timeout(50000);
    it('should render', function () {
        const schema = {
            LikeMe: {
                type: 'Checkbox',
                title: "Check if you do.",
                transition: {
                    transition: "rollUp",
                    on: ["appear"]
                }
            },
            LikeMeInfo: {
                type: 'Text',
                help: 'Explain why you like me',
                conditional: {
                    listen: "LikeMe",
                    operator: "===",
                    value: true,
                    transition: {
                        transition: "slideLeft",
                        on: ["enter", "appear", "leave"]
                    }
                }
            }


        };
        const {Form} = newSubschemaContext();
        into(<Form schema={schema}/>, true);
    });
});