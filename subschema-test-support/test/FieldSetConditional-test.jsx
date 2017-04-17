"use strict";
import {React, into,TestUtils,expect,byTypes, click, select, byTag, byType, change, byComponents,Simulate}  from 'subschema-test-support';
import Subschema, {Form, types, ValueManager, templates, loaderFactory, DefaultLoader} from 'Subschema';


describe("public/FieldSetConditional", function () {
    this.timeout(50000);
    it('should render', function (done) {
        const schema = {
            schema: {
                phoneOrEmail: {
                    type: 'Radio',
                    title: false,
                    options: [{label: "Phone", val: "phone"}, {label: "Email", val: "email"}],
                },
                "phone": {
                    "type": "Text"
                },
                "canWePhone": "Checkbox",
                "canWeEmail": "Checkbox",
                "email": {
                    "type": "Text"
                }
            },
            fieldsets: [{legend: "Would you prefer us contact you via?", fields: "phoneOrEmail"},
                {
                    legend: "Phone",
                    buttons: ["Call Me"],
                    fields: ["phone", "canWePhone"],
                    conditional: {
                        listen: "phoneOrEmail",
                        operator: "==",
                        value: "phone",
                        transition: "rollUp"

                    }
                },
                {
                    legend: "Email",
                    buttons: ["Email Me"],
                    fields: ["email", "canWeEmail"],
                    conditional: {
                        listen: "phoneOrEmail",
                        operator: "==",
                        value: "email",
                        transition: "rollUp"
                    }
                }]
        };
        const vm = ValueManager();
        const form = into(<Form schema={schema} valueManager={vm}/>, true);
        byComponents(form, templates.FieldSetTemplate, 1);
        vm.update('phoneOrEmail', 'phone');

        setTimeout(()=> {
            byComponents(form, templates.FieldSetTemplate, 2);
            done();
        }, 1000);
    });
});