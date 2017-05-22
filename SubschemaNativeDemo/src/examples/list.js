export default ({
    name: "List",
    description: "Create a list",
    value: {email: 'hello@test.com', password: '123', lollipops: ["red", "green", "blueberry"]},
    schema: {
        schema: {
            "lollipops": {
                "type": "List",
                "canEdit": true,
                "canAdd": true,
                "canReorder": true,
                "canDelete": true
            }
        },
        fields: ["lollipops"]
    }
})