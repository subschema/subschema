const schema1 = {
    schema: {
        header: 'Header',
        form: {
            type: 'Object',
            schema: 'Form1'
        },
        footer: 'Footer'
    },
    fieldsets: [
        {

            fields: ["header", "form", "footer"]
        }
    ]
};

const schema2 = {
    schema: {
        header: 'Header',
        form: {
            type: 'Object',
            schema: 'Form2'
        },
        footer: 'Footer'
    },
    fieldsets: [
        {

            fields: ["header", "form", "footer"]
        }
    ]
};

const megaSchema = {

    schema: {
        page: 'Page',
        transitions: [{
            'form': 'slide-in'
        }]
    },
    fieldsets: "page"
};


<Form transition={{fields:['form']}} schema={schema1}/>