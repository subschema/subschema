module.exports = {
    description: 'Shows how you could use a conditional to show hide, based on error or toggle value.  Click data and error in the menu see it in action',
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
            "showAddress": {
                "type": "Checkbox",
                "title": "Show Address",
                "help":"Click this to toggle the address"

            },
            "address": {
                type: "Object",
                title: false,
                conditional: {
                    listen: "showAddress",
                    operator: "truthy"/*,
                    error: 'address'*/
                },
                fields: "street, city, state, zip",
                subSchema: {
                    street: {type: 'Text', validators: ['required']},
                    city: 'Text',
                    state: {
                        options: ['CA', 'NV', 'DE'],
                        type: 'Select'
                    },
                    zip: {
                        type: 'Text',
                        validators: ['required', {type:'regexp', regexp:'/^[0-9]{5}(-([0-9]{4}))?$/'}]
                    }
                }
            }
        },
        "fieldsets": [{
            "legend": "Name",
            "fields": ["title", "name", "email", "showAddress", "address"],
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
        showAddress: true,
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
