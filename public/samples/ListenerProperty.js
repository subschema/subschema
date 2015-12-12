module.exports = {
    description: 'Shows how you can use Listeners on Custom Types',
    schema: {
        schema: {
            myDefault: {
                type: 'SelectListen',
                options: 'favorites'
            },
            favorites: {
                type: 'List',
                canAdd: true,
                canEdit: true,
                canReorder: true,
                canDelete: true,
                labelKey: 'label',
                itemType: {
                    type: 'Object',
                    subSchema: {
                        val: 'Text',
                        label: 'Text'
                    }
                }
            }
        },
        fields: ["myDefault", "favorites"]
    },
    props: {
        loader: true
    },
    data: {
        myDefault:'got',
        favorites: [
            {
                label: 'Game of Thrones',
                val: 'got'
            },
            {
                label: 'Casual',
                val: 'casual'
            }
        ]
    },
    setupFile: 'ListenerProperty-setup.js'
}
