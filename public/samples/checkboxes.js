module.exports = {
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
            groupsOfGroups: {
                options: [
                    {
                        group: 'North America', options: [
                        {val: 'ca', label: 'Canada'},
                        {val: 'us', label: 'United States'}
                    ],
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
    data:{},
    errors:{}


}