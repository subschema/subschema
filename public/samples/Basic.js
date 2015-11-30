module.exports = {
    description: 'Super basic form, with select and a requied name',
    schema: {
        "schema": {
            "title": {"type": "Select", "options": ["Mr", "Mrs", "Ms"]},
            "name": {type: "Text", validators: ['required']},
            "age": {type: 'Number'}

        },
        "fieldsets": [
            {
                "legend": "Name",
                "fields": "title, name, age",
                buttons: [{
                    label: 'Cancel',
                    action: 'cancel',
                    buttonClass: 'btn'
                }, {
                    label: 'Submit', action: 'submit',
                    buttonClass: 'btn btn-primary'
                }]
            }]
    },
    data: {
        title: 'Mrs',
        name: 'Johnson'
    },
    errors: {
        name: [{
            message: 'Name is already taken'
        }]
    }

};
