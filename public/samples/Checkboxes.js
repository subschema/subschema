module.exports = {
    description: 'The most usable of UI components the lowly checkbox.   This shows single value, groups of checkboxes and a true/false',
    schema: {
        schema: {
            group1: {
                options: ['one', 'two', 'three'],
                type: 'Checkboxes'
            },
            group2: {
                options: [{val: 'one'}, {val: 'two', labelHTML: '<h2>awesome</h2>'}],
                type: 'Checkboxes'
            },
            trueFalse: {
                type: 'Checkbox',
                title: 'True or False No Value'
            },
            groupsOfGroups: {
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
        }
    },
    data: {
        trueFalse: true,
        group1: ['two'],
        group2: ['one'],
        groupsOfGroups: [
            'us',
            'uk'
        ]
    },
    errors: {
        groupsOfGroups: [{message: 'Even a checkbox can go wrong'}]
    }


}