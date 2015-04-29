module.exports = {
    description: 'Selects for selection',
    schema: {
        schema: {
            select: {
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
                type: 'Select'
            },
            withPlaceholder: {
                placeholder: 'Please Select An Option',
                help: 'The placeholder becomes the default selection on an select box, use required to force selection',
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
                type: 'Select'
            },
            multiple: {
                placeholder: 'Please Select An Option',
                multiple: true,
                help: 'The placeholder becomes you can select multiple',
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
                type: 'Select'
            }
        }
    },
    data: {
        select: 1,
        withPlaceholder: 2,
        multiple: [0, 2]
    },
    errors: {}


}