module.exports = {
    name: 'Custom Type',
    description: 'Shows how to create a custom type',
    schema: {
        "schema": {
            "areYouSure": {
                "type": "SwitchButton",
                "onText": "On",
                "offText": "Off",
                "title": "Are you sure?"
            }
        },
    },
    imports: {
        'subschema': ['loader']
    },
    props: ["loader"],
    data: {
        areYouSure: true
    }
};
