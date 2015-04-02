module.exports = {
    schema: {
        schema: {
            radio1: {
                options: [
                    {
                        val: 0,
                        label: "Option 1"
                    },
                    {
                        val: 1,
                        label: "Option 2"
                    },
                    {
                        val: 2,
                        label: "Option 3"
                    }
                ],
                type: 'Radio'
            },
            radio2: {
                options: ['Sterling', 'Lana', 'Cyril', 'Cheryl', 'Pam'],
                type: 'Radio'
            },
            radioWithLabel: {
                options: [
                    {
                        labelHTML: '<b>HTML</b>'
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