module.exports = {
    description: 'Super basic form, with select and a requied name that shows content',
    schema: {
        "schema": {
            "title": {"type": "Select", "options": ["Mr", "Mrs", "Ms"]},
            "name": {type: "Text", validators: ['required']},
            "age":{type:'Text', dataType:'number'},
            'content':{

                type:"Content",
                title:false,
                className:'col-sm-offset-2',
                content:'{title} {..name} is {age}'
            }

        },
        "fieldsets": [{"legend": "Name", "fields": ["title", "name","age", "content"]}]
    },
    data: {
        title: 'Mrs',
        name: 'Johnson',
        age:33
    },
    errors: {
        name: [{
            message: 'Name is already taken'
        }]
    }

};
