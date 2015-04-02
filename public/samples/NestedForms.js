module.exports = {
    schema: {
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
            "address": {
                type: "Object",
                title: false,
                subSchema: {
                    street: {type: 'Text', validators: ['required']},
                    city: 'Text',
                    state: {
                        options: ['CA', 'NV', 'DE'],
                        type: 'Select'
                    },
                    zip: {
                        type: 'Text',
                        validators: ['required', /^[0-9]{5}(-([0-9]{4}))?$/]
                    }
                }
            }
        },
        submitButton:'Submit',
        "fieldsets": [{
            "legend": "Name",
            "fields": ["title", "name", "email"]
        },
            {
                legend: "Address",
                fields: "address.street, address.city, address.state, address.zip"
            }

        ]
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
