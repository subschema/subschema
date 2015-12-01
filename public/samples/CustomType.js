module.exports = {
    description: 'Shows how to create a custom type',
    schema: {
        "schema": {
            "areYouSure": {
                "type": "SwitchButton",
                "onText": "On",
                "offText": "Off",
                "title": "Are you sure?"
            }
        },
    },
    data: {
        areYouSure: true
    },
    errors: {
        name: [{
            message: 'Name is already taken'
        }]
    },
    setupTxt: require('!!raw!./CustomType-setup.js')
}
