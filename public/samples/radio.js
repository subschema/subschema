module.exports = {
    description: 'Getting radios right is suprisingly tricky.  Here we demonstrate how to use groups radios and radio groups',
    schema: {
        schema: {
            radio1: {
                options:  "Option 1, Option 2, Option 3",
                checkedClass: 'checked',
                type: 'Radio',
                title:'Radio with forceSelection',
                forceSelection: true
            },
            radio2: {
                checkedClass: 'checked',
                options: ['Sterling', 'Lana', 'Cyril', 'Cheryl', 'Pam'],
                type: 'Radio'
            },
            radioWithLabel: {
                options: [
                    {
                        label: '<b>HTML</b>'
                    }
                ],
                type: 'Radio'
            }
        }
    },
    data: {
        radio1: 1,
        radio2: 'Cyril',
        radioWithLabel: 0
    },
    errors: {}


}