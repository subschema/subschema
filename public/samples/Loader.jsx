module.exports = {
    description: 'This shows how to use a loader to load a schema.\
    It can be used to load Templates, Processors, Types, Schemas and Validators. Here we are demonstrating templates and schemas, but the same pattern applies to the other types\
    They all follow the same pattern.   Note the list`type` is optional, but useful for future introspection if needed\
    ',
    schema: 'Contact',
    data: {
        name: 'Robert Loblaw',
        primary: {
            address: '123 Main St',
            city: 'San Jose',
            state: 'CA'
        },
        otherAddresses: [
            {
                address: '456 2nd St',
                city: 'Chicago',
                state: 'IL'
            },
            {
                address: '3232 Fillmore St',
                city: 'Arlington',
                state: 'VA'
            }
        ]
    },
    errors: {
        'primary.address': [{message: 'No Such Place'}]
    },
    setup: require('./Loader-setup.jsx'),
    setupTxt:require('!!raw!../sample-loader!./Loader-setup.jsx')
}