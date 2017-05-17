export default ({
    "schema": {
        "ssn": {
            "type": "Restricted",
            "formatter": '###-##'
        },
        "radio": {
            "type": "Radio",
            "options": [{val: 1, label: 'One'}, {val: 2, label: 'Two'}]
        },
        "checkboxes": {
            title: 'Group of Groups',
            options: [
                {
                    group: 'North America', options: [
                    {val: 'ca', label: 'Canada'},
                    {val: 'us', label: 'United States'}
                ]
                },
                {
                    group: 'Europe', options: [
                    {val: 'es', label: 'Spain'},
                    {val: 'fr', label: 'France'},
                    {val: 'uk', label: 'United Kingdom'}
                ]
                }
            ],
            type: 'Checkboxes'
        },
        "email": {
            "type": "Text",
            "validators": [
                "required",
                "email"
            ]
        },
        "password": {
            "type": "Password",
            "validators": [
                "required"
            ]
        },
        "remember": {
            "type": "Checkbox",
            "title": "Remember Me?"
        },
        "fromWhere": {
            "type": "Select",
            "options": "Work, Home, School, Kids"
        },
        "lollipops": {
            "type": "List",
            "canEdit": true,
            "canAdd": true,
            "canReorder": true,
            "canDelete": true
        }
    },
    "template": "WizardTemplate",
    "fieldsets": [
        {
            "legend": "SSN",
            fields: ["ssn"]
        },
        {
            "legend": "Radio",
            fields: ["radio", "checkboxes"]
        },
        {
            "legend": "List",
            "fields": "lollipops"
        },
        {
            "legend": "Login",
            "fields": [
                "email",
                "password"
            ]
        },
        {
            "legend": "Rem",
            "fields": ["remember", "fromWhere"]
        },
        {
            "legend": "Done",
            "fieldsets": {template: "JSONView"},
            "buttons": [
                {
                    "label": "Submit",
                    "primary": true
                },
                "Cancel"
            ]
        }
    ]
});
