export default ({
    name: "Wizard",
    description: "Wizard template",
    value: {
        "name": "Joe",
        "birthdate": "02/11",
        "confirm": true
    },
    schema: {
        "schema": {
            "name": "Text",
            "birthdate": "Date",
            "confirm": {
                "title": "Is this correct",
                "type": "Checkbox"
            }
        },
        "template": "WizardTemplate",
        "fieldsets": [{legend: "Name", fields: ["name"]}, {legend: "Birth", fields: ["birthdate"]}, {
            legend: "Confirm",
            fields: "confirm"
        }]
    }
})