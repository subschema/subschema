module.exports = {
    schema: {
        schema: {
            hideme: {
                type: 'Hidden'
            }

        },
        fieldsets: {legend: 'Magical Hidden Field', fields: ['hideme']}
    },
    data: {
        hideme: {
            stuff: {
                is: {
                    here: 1
                }
            }
        }
    },
    errors: {}


}