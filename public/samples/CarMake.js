module.exports = {
    title:'Selection of Selections',
    description: 'This shows how selects can be connected.\
     ',
    schema: {
        schema: {
            'make': {
                title: 'Make',
                type: 'Select',
                placeholder:'Select a make'
            },
            'model': {
                title: 'Model',
                type: 'Select',
                placeholder:'Select a model'
            }
        },
        fieldsets: [{legend: 'Make And Model Linked Selects', fields: ['make', 'model']}]
    },
    data: {
        make: 'audi',
        model: '4000'
    },
    setup: require('./CarMake-setup.js'),
    setupTxt: require('!!raw!../sample-loader!./CarMake-setup.js')
}