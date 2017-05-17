export default ({
    "name": "Checkboxes",
    "description": "Arrays of checkboxes",
    "value": {
        "checkboxes": ["us", "uk"]
    },
    "schema": {
        "schema": {
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
            }
        },
        "fields": "checkboxes"
    }
})