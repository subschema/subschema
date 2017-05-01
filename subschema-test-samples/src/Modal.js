module.exports = {
    description: 'Shows how you could use a conditional with a modal',
    "schema": {
        "schema": {
            "title": {
                "type": "Select",
                "options": ["Mr", "Mrs", "Ms"]
            },
            "name": "Text",
            "email": {
                type: "Text",
                dataType: 'email',
                validators: ['required', 'email']
            },
            "showAddressModal": {
                "type": "Checkbox",
                "title": "Edit Address",
                "help": "Click the checkbox to see the modal"
            },
            "address": {
                type: "Object",
                conditional: {
                    listen: "showAddressModal",
                    operator: "truthy",
                    dismiss: 'showAddressModal',
                },
                template:'ModalTemplate',
                title: "See the modal?",
                subSchema: {
                    schema: {
                        street: {type: 'Text', validators: ['required']},
                        city: 'Text',
                        state: {
                            options: ['CA', 'NV', 'DE'],
                            type: 'Select'
                        },
                        zip: {
                            type: 'Text',
                            validators: ['required', {type: 'regexp', regexp: '/^[0-9]{5}(-([0-9]{4}))?$/'}]
                        }
                    },
                    fields: "street, city, state, zip",
                }
            }
        },
        "fieldsets": [{
            "legend": "Name",
            "fields": ["title", "name", "email", "showAddressModal", "address"],
            buttons: [

                {
                    label: "Submit",
                    className: 'btn btn-primary pull-right'
                }
            ]
        }]
    },
    data: {
        title: 'Mr',
        name: 'bob',
        email: 'bob@b.co',

        address: {
            street: '1 First St',
            city: 'San Jose',
            state: 'CA',
            zip: 95109
        }
    },
    errors: {
        'address.city': [{
            message: 'Not the right place'
        }]
    }
};
