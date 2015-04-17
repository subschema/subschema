module.exports = {
    description: 'Super basic form, with select and a requied name',
    schema: {
        "schema": {
            "title": {"type": "Select", "options": ["Mr", "Mrs", "Ms"]},
            "name": {type: "Text", validators: ['required']}

        },
        "fieldsets": [{"legend": "Name", "fields": ["title", "name"]}]
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
