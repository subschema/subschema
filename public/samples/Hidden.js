module.exports = {
    description: 'Sometimes you do not want to show your data.  Hidden type to the rescue.\
    The only thing special about hidden, is that it does not render the surrounding editor markup, as if something is hidden its\
    label should be hidden also\
    ',
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