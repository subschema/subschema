export default({
    name: "Select",
    description: "Simple select example",
    value: {
        "fromWhere": "School"
    },
    schema: {
        schema: {
            "fromWhere": {
                "type": "Select",
                "options": "Work, Home, School, Kids"
            },
        },
        fields: ["fromWhere"]
    }
})