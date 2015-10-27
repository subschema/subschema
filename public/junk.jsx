(function (React, Form, Subschema, mountNode) {
    return React.createClass({
        // childContextTypes: { test: React.PropTypes.string },
        childContextTypes: {  },
        getChildContext: function () { return {}; },
        render: function () {
            return (
            var schema = {
                "schema": {
                    "title": {
                        "type": "Select",
                        "options": [
                            "Mr",
                            "Mrs",
                            "Ms"
                        ]
                    },
                    "name": "Text",
                    "email": {
                        "type": "Text",
                        "dataType": "email",
                        "validators": [
                            "required",
                            "email"
                        ]
                    },
                    "showAddress": {
                        "type": "Checkbox",
                        "title": "Show Address",
                        "help": "Click this to toggle the address"
                    },
                    "address": {
                        "type": "Object",
                        "title": false,
                        "conditional": {
                            "listen": "showAddress",
                            "operator": "truthy"
                        },
                        "fields": "street, city, state, zip",
                        "subSchema": {
                            "street": {
                                "type": "Text",
                                "validators": [
                                    "required"
                                ]
                            },
                            "city": "Text",
                            "state": {
                                "options": [
                                    "CA",
                                    "NV",
                                    "DE"
                                ],
                                "type": "Select"
                            },
                            "zip": {
                                "type": "Text",
                                "validators": [
                                    "required",
                                    {}
                                ]
                            }
                        }
                    }
                },
                "fieldsets": [
                    {
                        "legend": "Name",
                        "fields": [
                            "title",
                            "name",
                            "email",
                            "showAddress",
                            "address"
                        ],
                        "buttons": [
                            {
                                "label": "Submit",
                                "className": "btn btn-primary pull-right"
                            }
                        ]
                    }
                ]
            };
            var data = {};
            var errors = null;
            var props = null;
            <Form schema={schema}/>
            );
        }
    });
});