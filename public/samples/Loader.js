module.exports = {
    description: 'This shows how to use a loader to load a schema',
    schema: {
        schema: 'Contact'
    },
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
    unsetup: function (l) {
        var loader = require('subschema').loader;
        loader.removeLoader(l);
    },
    setup: function () {
        var loader = require('subschema').loader;

        var loaded = loader.addSchema({
            Address: {
                address: 'Text',
                city: 'Text',
                state: {
                    type: 'Select',
                    options: ['CA', 'FL', 'VA', 'IL']
                },
                zipCode: {
                    type: 'Text',
                    dataType: 'number'
                }
            },
            Contact: {
                schema: {
                    name: 'Text',
                    primary: {
                        type: 'Object',
                        subSchema: 'Address'
                    },
                    otherAddresses: {
                        canEdit: true,
                        canReorder: true,
                        canDelete: true,
                        canAdd: true,
                        type: 'List',
                        labelKey: 'address',
                        itemType: {
                            type: 'Object',
                            subSchema: 'Address'
                        }
                    }
                },
                fields: ['name', 'primary', 'otherAddresses']
            }
        });
        return loaded;
    }
}