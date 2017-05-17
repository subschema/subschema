export default ({
    name: 'Autocomplete',
    description: `Autocomplete adds static or dynamic autocompletion.`,
    schema: {
        schema: {
            'simple': {
                type: 'Autocomplete',
                options: ['aaaa', 'aaab', 'aba', 'baaa', 'caaa']
            }
        }
    },
    value: {
        simple: 'aaaa'
    }
});