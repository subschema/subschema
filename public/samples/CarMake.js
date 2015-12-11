"use strict";

module.exports = {
    title: 'Selection of Selections',
    description: 'This shows how selects can be connected.\
     ',
    schema: {
        schema: {
            'make': {
                title: 'Make',
                type: 'Select',
                placeholder: 'Select a make'
            },
            'model': {
                title: 'Model',
                type: 'Select',
                placeholder: 'Select a make first',
                conditional: {
                    'listen': 'make',
                    'operator': 'falsey'
                }
            }
        },
        fieldsets: [{legend: 'Make And Model Linked Selects', fields: ['make', 'model']}]
    },
    data: {
        make: 'audi',
        model: '4000'
    },
    props: {
        valueManager: true
    },
    setup: function (scope, props) {
        props.valueManager = 'Subschema.ValueManager(' + JSON.stringify(props.value, null, '\t') + ')';
        delete props.value;
    },
    setupFile: 'CarMake-setup.js'
}