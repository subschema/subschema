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
    props:{
        loader:true
    },
    data: {
        areYouSure: true
    }
};
