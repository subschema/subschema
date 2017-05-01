module.exports = {
    data: {
        'phoneOrEmail': 'phone'
    },
    description: 'Shows how you can use Transitions on fieldsets',
    schema: {
        schema: {
            phoneOrEmail: {
                type: 'Radio',
                title: false,
                options: [{label: "Phone", val: "phone"}, {label: "Email", val: "email"}],
            },
            "phone": {
                "type": "Text"
            },
            "canWePhone": "Checkbox",
            "canWeEmail": "Checkbox",
            "email": {
                "type": "Text"
            }
        },
        fieldsets: [{legend: "Would you prefer us contact you via?", fields: "phoneOrEmail"},
            {
                legend: "Phone",
                buttons: ["Call Me"],
                fields: ["phone", "canWePhone"],
                conditional: {
                    listen: "phoneOrEmail",
                    operator: "==",
                    value: "phone",
                    transition: {
                        transition: "rollUp",
                        on: ["appear", "enter", "leave"]
                    }
                }
            },
            {
                legend: "Email",
                buttons: ["Email Me"],
                fields: ["email", "canWeEmail"],
                conditional: {
                    listen: "phoneOrEmail",
                    operator: "==",
                    value: "email",
                    transition: "rollUp"
                }
            }]
    }
};