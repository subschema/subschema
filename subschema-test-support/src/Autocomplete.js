module.exports = {
    description: `Autocomplete adds static or dynamic autocompletion.
     If options are passed than it behaves mostly like the select component.
     If a processor is passed than it can load dynamically.
     `,
    schema: {
        schema: {
            'simple': {
                type: 'Autocomplete',
                options: ['aaaa', 'aaab', 'aba', 'baaa', 'caaa']
            },
            'ajax': {
                type: 'Autocomplete',
                processor: 'fakeAjax'
            }
        }
    },
    data: {
        simple: 'aaaa',
        ajax: {
            val: '1',
            label: 'a 1'
        }
    },
    props: {
        "loader": true
    }
};