"use strict";
import {React, into,TestUtils,expect,byTypes, click, select, byTag, byType, change, byComponents,Simulate}  from 'subschema-test-support';
import Subschema, {Form, types, ValueManager, templates, loaderFactory, DefaultLoader} from 'Subschema';


describe.only("public/MoreInfo", function () {
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
        into(<Form schema={schema}/>, true);
    });
});