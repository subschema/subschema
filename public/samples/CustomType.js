module.exports = {
    name: 'Custom Type',
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
    props:{
        loader:true
    },
    setupFile: 'CustomType-setup.js'
}
